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
    protected $table='profils';
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

    /**
     *  Récupère les modules avec les droits à visu/modif/no_access selon le profil
     * @param $idProfil: ID du profil concerné
     * @return array
     */
    public static function getProfilModule($idProfil)
    {
        $aTabModule = [];

        // Récupère tout les modules avec les droits associés au profil
        if ($idProfil !== 0) {
            $aTabModule = Module::leftJoin('profil_module', function ($join) use ($idProfil) {
                $join->on('profil_module.module_id', '=', 'modules.id');
                $join->on('profil_module.profil_id', '=', DB::raw($idProfil));
            })
                ->groupBy('modules.id')
                ->get(['modules.id', 'modules.traduction', DB::raw("IFNULL(profil_module.access_level,'no_access')AS access_level")]);
        }
        // Récupère uniquement les modules */
        else {
            $aTabModule = Module::all(array('id', 'traduction', DB::raw("'no_access' AS access_level")));
        }

        // Parcours des modules
        foreach ($aTabModule as &$module) {
            $trad = $module['traduction'];
            // Item de menu top
            if (Lang::has('menu.top.' . $trad)) {
                $trad = Lang::get('menu.top.' . $trad);
            }
            // Item de menu side
            else if (Lang::has('menu.side.' . $trad)) {
                $trad = Lang::get('menu.side.' . $trad);
            }

            $module['traduction'] = $trad;
//            Log::warning($trad);
        }

        return $aTabModule;
    }

    /**
     * Calcule si le libellé passé en paramètre existe en BDD
     * @param $libelle: libellé à tester
     * @param int $idProfil (optionnel): en edition de profil ne pas prendre le profil en cours d'édition
     * @return array
     */
    public static function isLibelleExists($libelle, $idProfil = 0){
        // Condition supplémentaire en mode édition
        $and = $idProfil === 0 ? '' : "AND id <> $idProfil";
        // Requete
        $result = Profil::whereRaw("traduction = '$libelle' $and")->count();
//        dd($result);
        return ($result > 0);
    }

    /**
     * Le profil est-il associé à un utilisateur
     * @param $idProfil
     * @return array
     */
    public static function isProfilUsed($idProfil){
        $profil = DB::table('profil_utilisateur')->where('profil_id', $idProfil)->first(['id']);
        return !empty($profil);
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
    public static function creerProfil($inputs){
        // Variables
        $bSave    = true;

        // Le nom de profil est unique
        if(!Profil::isLibelleExists($inputs['libelle'])) {

            // Récupère la donnée du profil
            $fieldProfil = ['traduction' => $inputs['libelle']];

            // Transaction enregistrement BDD profil + profil_module
            try {
                // Début transaction SQL
                DB::beginTransaction();

                // Créer profil
                $idProfil = Profil::insertGetId($fieldProfil);

                // Parcours de l'état de chaque module
                foreach ($inputs as $key => $value) {
                    // On coupe le name courant selon '_'
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
                // Retour au JS
                $retour = array(
                    'idProfil' => $idProfil,
                    'nameProfil' => $fieldProfil['traduction'],
                    'save' => $bSave);
            }
            // Erreur SQL dans la transaction
            catch (Exception $e) {
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
        // Trouver le user
        $profil = Profil::find($id);

        // Mise à jour de la traduction
        $profil->traduction = $fields['libelle'];

        // Sauvegarde
        try {
            // Début transaction SQL
            DB::beginTransaction();

            // Table profil sauvegardée
            if($profil->save()){

                // Parcours de l'état de chaque module
                foreach ($fields as $key => $value) {
                    // On coupe le name courant selon '_'
                    $aEtat = explode('_',  $key);
                    // Radio
                    if($aEtat[0] == 'etat') {
                        // Requete profil_module
                        $ligne = DB::table('profil_module')
                            ->where('module_id', $aEtat[1])
                            ->where('profil_id', $id)
                            ->first(['profil_module.*']);

                        // Module déjà associé au profil
                        if(count($ligne)>0) {
                            // Plus d'accès
                            if($value == 'no_access') {
                                $bSave = DB::table('profil_module')->delete($ligne->id);
                            }
                            // Droit modifié
                            else if ($ligne->access_level != $value) {
                                $update = [
                                    'module_id' => $aEtat[1],
                                    'profil_id' => $id,
                                    'access_level' => $value
                                    ];
                                $bSave = DB::table('profil_module')->where('id', $ligne->id)->update($update);
                            }
                        }
                        // Nouveau droit
                        else if( $value != 'no_access'){
                            $ligne = [
                                'module_id' => $aEtat[1],
                                'profil_id' => $id,
                                'access_level' => $value
                                ];

                            // Défini les droits associés au profil
                            $bSave = DB::table('profil_module')->insert($ligne);
                        }
                    }
                }
            }

            // Sauvegardes OK
            if($bSave) {
                // Validation transaction
                DB::commit();
            }
            // Sauvegarde KO
            else {
                // Annulation transaction
                DB::rollback();
            }
        }
        catch (Exception $e) {
            Log::warning('-----------> catch : ' . $e->getMessage() . ' <-----------');
            $bSave = false;
            DB::rollback();
        }
        return array(
            'idProfil' => $id,
            'nameProfil' => $fields['libelle'],
            'save' => $bSave
        );
    }
}