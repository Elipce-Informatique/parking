<?php
/**
 * Created by PhpStorm.
 * User: yann
 * Date: 24/11/2014
 * Time: 10:16
 */

class Profil extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamp = false;

    protected $fillable = ['traduction'];


    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function modules()
    {
        return $this->belongsToMany('Module', 'profil_module')->withPivot(['access_level']);
    }

    public function utilisateurs()
    {
        return $this->belongsToMany('Utilisateur');
    }
    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER
    |--------------------------------------------------------------------------
    */
    /* Récupère les modules avec les droits à visu/modif/aucun selon le profil */
    public static function getProfilModule($idProfil)
    {
        $aTabModule = [];

        /* Récupère tout les modules avec les droits associés au profil */
        if ($idProfil != 0) {
            $aTabModule = Module::leftJoin('profil_module', function ($join) use ($idProfil) {
                $join->on('profil_module.module_id', '=', 'modules.id');
                $join->on('profil_module.profil_id', '=', DB::raw($idProfil));
            })
                ->groupBy('modules.id')
                ->get(['modules.id', 'modules.traduction', 'profil_module.access_level']);
        } /* Récupère uniquement les modules */
        else
            $aTabModule = Module::all(array('id', 'traduction', DB::raw('"no_access" AS etat')));

        return $aTabModule;
    }

    public static function getProfilExistLibelle($libelle){
        $profil = DB::table('profils')->where('traduction', $libelle)->first(['id']);
        return array('good' => empty($profil));
    }

    public static function getIsProfilUse($idProfil){
        $profil = DB::table('profil_utilisateur')->where('profil_id', $idProfil)->first(['id']);
        return array('good' => !empty($profil));
    }

    /**
     * Supprime un profil
     * @param $id : ID profil
     * @return array('save' => bool, enregistrement OK ou KO)
     *
     */
    public static function deleteProfil($id)
    {
        // Variables
        $bSave = true;

        // Chercher user
        $profil = Profil::find($id);

        // Supprimer utilisateur
        try {
            $profil->delete();
        } catch (Exception $e) {
            $bSave = false;
        }
        return array('save' => $bSave);
    }

    /**
     * Créé un profil
     * @param $inputs : array($key=>$value) $key=champ table, $value=valeur
     * @return array('save' => bool, enregistrement OK ou KO)
     */
    public static function creerProfil($inputs)
    {
        Log::warning('Creer profil'.print_r($inputs, true));

        // Variables
        $bSave    = true;

        /* Vérifie que le profil n'existe pas */
        $res = Profil::getProfilExistLibelle($inputs['libelle']);

        // Le profil n'existe pas
        if($res['good']) {

            // Récupère la donnée du profil
            $fieldProfil = [];
            $fieldProfil['traduction'] = $inputs['libelle'];

            try {
                DB::beginTransaction();

                // Nouveau profil
                $idProfil = Profil::insertGetId($fieldProfil);

                // Parcours tous les champs envoyés par l'utilisateur
                foreach ($inputs as $value => $key) {
                    // On coupe le name courant
                    $aEtat = explode('_',  $key);
                    // Radio
                    if($aEtat[0] == 'etat') {
                        // Un accès au module est défini
                        if ($value !== 'no_access') {
                            // Préparation requête
                            $ligne = [
                                'module_id' => $aEtat[1],
                                'profil_id' => $idProfil,
                                'access_level' => $value
                            ];

                            // Insertion accès au module et niveau d'accès
                            $bSave = DB::table('profil_module')->insert($ligne);
                        }
                    }
                }
                // Envoi transaction
                DB::commit();
                $retour = array('idProfil' => $idProfil, 'nameProfil' => $fieldProfil['traduction'], 'save' => $bSave);
            } catch (Exception $e) {
                // Transaction annulée
                DB::rollback();
                $retour = array('save' => false);
            }
        }
        // Le profil existe déjà
        else {
            $retour = array('save' => false);
        }

        return $retour;
    }


    /**
     * Met à jour les infos d'un profil
     * @param $id : ID profil
     * @param $fields : array($key=>$value) $key=champ table, $value=valeur
     * @return array('data' => tableau de données, 'save' => bool, enregistrement OK ou KO)
     */
    public static function updateProfil($id, $fields)
    {
        Log::warning('-----------> updateProfil $id : '.$id.'<-----------');
        Log::warning('-----------> updateProfil $fields : '.print_r($fields, true).'<-----------');

        // Trouver le user
        $profil = Profil::find($id);

        // Mise à jour de la traduction
        $profil->traduction = $fields['libelle'];

        // Sauvegarde
        try {
            DB::beginTransaction();

            $bSave = $profil->save();

            if($bSave == true) {

                // Met à jour la relation avec les modules
                $matrice = explode(',', $fields['matrice']);

                for ($i = 0; $i < count($matrice) && $bSave == true; $i += 2) {

                    $idModule     = $matrice[$i+1];
                    $accesssLevel = $matrice[$i];

                    /* Est-ce que la ligne existe ? */
                    $ligne = DB::table('profil_module')
                               ->where('module_id', $idModule)
                               ->where('profil_id', $id)
                               ->first(['profil_module.*']);

                    /* La ligne existe */
                    if(count($ligne)>0) {
                        /* Droit à null, on supprime la ligne */
                        if($accesssLevel == 'null') {
                            $bSave = DB::table('profil_module')->delete($ligne->id);
                            Log::warning('-----------> $bSave : '.$bSave.' <-----------');
                        }
                        /* Nouveau droit */
                        else if ($ligne->access_level != $accesssLevel) {
                            $update = [];
                            $update['module_id']    = $idModule;
                            $update['profil_id']    = $id;
                            $update['access_level'] = $accesssLevel;
                            $bSave = DB::table('profil_module')->where('id', $ligne->id)->update($update);
                        }
                    }
                    /* La ligne n'existe pas, on la créer */
                    else if( $accesssLevel != 'null'){
                        $ligne = [];
                        $ligne['module_id']    = $idModule;
                        $ligne['profil_id']    = $id;
                        $ligne['access_level'] = $accesssLevel;

                        // Défini les droits associés au profil
                        $bSave = DB::table('profil_module')->insert($ligne);
                    }
                }
            }

            if($bSave == true)
                DB::commit();
            else
                DB::rollback();
        }
        catch (Exception $e) {
            Log::warning('-----------> catch : ' . $e->getMessage() . ' <-----------');
            $bSave = false;
            DB::rollback();
        }
        return array('idProfil' => $id, 'nameProfil' => $fields['libelle'], 'save' => $bSave);
    }
}