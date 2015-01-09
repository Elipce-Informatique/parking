<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class Utilisateur extends Eloquent implements UserInterface, RemindableInterface
{

    use UserTrait, RemindableTrait;

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamp = false;

    protected $fillable = ['nom', 'prenom', 'email', 'password'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = array('password', 'remember_token');

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function profils()
    {
        return $this->belongsToMany('Profil');
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER DE CLASSE
    |--------------------------------------------------------------------------
    */
    public function getMenuTopItems()
    {
        if (Session::has('menu_top_items')) {
            $modules = Session::get('menu_top_items');
        } else {
            $modules = $this
                ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
                ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
                ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
                ->join('modules', 'modules.id', '=', 'profil_module.module_id')
                ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
                ->where('utilisateurs.id', $this->id)
                ->where('module_module.is_menu', 1)
                ->whereNull('module_module.parent_id')
                ->groupBy('modules.id')
                ->get(['modules.*', DB::raw('1 as accessible')]);
            Session::put('menu_top_items', $modules);
        }

        return $modules;
    }

    /**
     * Retourne les infos pour construire le menu de l'utilisateur dans le menu top
     *
     * @return mixed
     */
    public function menuTopInfosUser()
    {
        /* TODO dropdown : menu déroulant contenant les raccourcis de l'utilisateur
         * [
         *   {label: "profil", route:"/utilisateur/120"},
         *   {label: "parametres", route:"/parametres"}
         * ]
         **/
        return json_encode([
            'nomUtilisateur' => $this->nom,
            'logoutRoute' => URL::asset('/') . "logout",
            'logoutText' => Lang::get('global.logout'),
            'dropdown' => [['label' => Lang::get('menu.user.params'), 'route' => URL::route('index')]]
        ]);
    }

    /**
     *
     */
    public function getMenuLeftItemsFromUrl($url)
    {
        $entete = Module::getTopLevelParentModuleFromUrl($url);
        $tabRetour = [];
        if ($entete) {
            Module::getChildrenModulesRecursifWithDroitsForMenu($tabRetour, $entete->id, $this->id);
        }
        return $tabRetour;
    }


    /**
     * Test accessibilité en lecture
     * @param $url
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function isModuleAccessibleByUrl($url)
    {
        return (count($this
                ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
                ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
                ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
                ->join('modules', 'modules.id', '=', 'profil_module.module_id')
                ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
                ->where('modules.url', $url)
                ->where('utilisateurs.id', $this->id)
                ->groupBy('modules.id')
                ->get(['modules.*'])) != 0);
    }

    /**
     * Test accessibilité en lecture
     * @param $url
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function isModuleAccessible($id)
    {
        return (count($this
                ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
                ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
                ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
                ->join('modules', 'modules.id', '=', 'profil_module.module_id')
                ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
                ->where('modules.id', $id)
                ->where('utilisateurs.id', $this->id)
                ->groupBy('modules.id')
                ->get(['modules.*'])) != 0);
    }

    public function getAllModules()
    {
        //->groupBy('modules.id')
        return $this
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->groupBy('modules.id')
            ->get(['modules.*', 'profil_module.access_level']);
    }

    public function getAllModulesForAuthuser()
    {
        return $this
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('utilisateurs.id', $this->id)
            ->groupBy('modules.id')
            ->get(['modules.*', 'profil_module.access_level']);
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER STATIQUES
    |--------------------------------------------------------------------------
    */
    /**
     * Calcule la liste de tous les utilisateurs de l'application
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUtilisateurs()
    {
        $res = Utilisateur::all(array('id', 'nom', 'prenom','email'));//, DB::raw('email as mail2'), DB::raw('email as mail3')
        return $res;
    }

    /**
     * Infos d'un utilisateur
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUtilisateurFromId($id)
    {
        $res = Utilisateur::find($id);
        return $res;
    }

    public static function getUserAndProfil($id){

        /* Récupère tout les profils avec les droits associés à l'utilisateur ('oui'/'non') */
        if ($id != 0) {
            $data = Utilisateur::find($id);
            $data['dataProfil'] = [];

            $dataProfil = DB::table('profils')->leftJoin('profil_utilisateur', function ($join) use ($id) {
                $join->on('profil_utilisateur.profil_id', '=', 'profils.id');
                $join->on('profil_utilisateur.utilisateur_id', '=', DB::raw($id));
            })
                ->groupBy('profils.id')
                ->get(['profils.id', 'profils.traduction', 'profil_utilisateur.profil_id as etat']);


            $aDataProfil = [];
            for($i = 0; $i < count($dataProfil);$i++){
                $idProfil   = $dataProfil[$i]->id;
                $traduction = $dataProfil[$i]->traduction;
                $etat       = $dataProfil[$i]->etat;

                $ligne = array('id'=>$idProfil, 'traduction'=>$traduction, 'etat'=>'oui');

                if($etat == '')
                    $ligne['etat'] = 'non';

                $aDataProfil[$i] = $ligne;
            }

            $data['dataProfil'] = $aDataProfil;
        } /* Récupère uniquement les profils */
        else {
            $data = ['id'=>0, 'nom'=> '', 'prenom' => '', 'email' => '', 'photo' => 'app/documents/photo/no.gif'];
            $data['dataProfil'] = [];
            $data['dataProfil'] = DB::table('profils')->get(array('id', 'traduction', DB::raw('"non" as etat')));
        }

        return $data;
    }
    /**
     * Supprime un utilisateur
     * @param $id: ID user
     * @return array('data' => tableau de données, 'save' => bool, enregistrement OK ou KO)
     *
     */
    public static function deleteUser($id){
        // Variables
        $bSave = true;

        // Chercher user
        $user = Utilisateur::find($id);

        // Supprimer utilisateur
        try{
            $user->delete();
        }
        catch(Exception $e){
            $bSave = false;
        }
        return array('data'=>array('id'=>0, 'nom'=>'','prenom'=>'','email'=>''),'save'=>$bSave);
    }

    /**
     * Met à jour les infos d'un utilisateur
     * @param $id: ID user
     * @param $fields: array($key=>$value) $key=champ table, $value=valeur
     * @return array('data' => tableau de données, 'save' => bool, enregistrement OK ou KO)
     */
    public static function updateUser($id, $fields){

        Log::warning('-----------> updateUser $id : '.$id.'<-----------');
        // Variables
        $bSave = true;

        // Trouver le user
        $user = Utilisateur::find($id);

        // Parcourir les champs envoyés par PUT
        foreach($fields as $key=>$val) {
            $user->$key = $val;
        }

        // Sauvegarde
        try {
            DB::beginTransaction();

            $bSave = $user->save();

            if($bSave == true) {

                // Met à jour la relation avec les profils
                $matrice = explode(',', $fields['matrice']);

                for ($i = 0; $i < count($matrice) && $bSave == true; $i += 2) {

                    $idProfil = $matrice[$i+1];
                    $etat     = $matrice[$i];

                    /* Est-ce que la ligne existe ? */
                    $ligne = DB::table('profil_utilisateur')
                        ->where('profil_id', $idProfil)
                        ->where('utilisateur_id', $id)
                        ->first(['profil_utilisateur.*']);

                    /* La ligne existe et l'utilisateur n'a plus ce profil, on supprime la ligne */
                    if(count($ligne)>0 && $etat == 'non') {
                        $bSave = DB::table('profil_utilisateur')->delete($ligne->id);
                    }
                    /* La ligne n'existe pas, et l'utilisateur possède le profil, on crééer la ligne */
                    else if(count($ligne) == 0 && $etat == 'oui'){
                        Log::warning('-----------> updateUser $accesssLevel : '.$etat.'<-----------');
                        $ligne = [];
                        $ligne['utilisateur_id']    = $id;
                        $ligne['profil_id']    = $idProfil;

                        // Défini les droits associés au profil
                        $bSave = DB::table('profil_utilisateur')->insert($ligne);
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

        return array('save' => $bSave);
    }

    /**
     * Créé un utilisateur
     * @param $fields: array($key=>$value) $key=champ table, $value=valeur
     * @return array('idUser' => idUser, 'save' => bool)
     */
    public static function creerUtilisateur($fields){

        $bSave = true;

        /* Vérifie que l'utilisateur n'existe pas */
        $res = Utilisateur::getUserExist($fields['email']);

        if($res['good'] == true) {

            // Récupère la donnée de l'utilisateur
            $fieldUser = [];
            $fieldUser['nom']    = $fields['nom'];
            $fieldUser['prenom'] = $fields['prenom'];
            $fieldUser['email']  = $fields['email'];
            $fieldUser['photo']  = $fields['photo'];

            try {
                DB::beginTransaction();

                // Nouveau profil
                $idUser = Utilisateur::insertGetId($fieldUser);

                // Récupère les profils de l'utilisateur
                $matrice = explode(',', $fields['matrice']);

                for ($i = 0; $i < count($matrice) && $bSave == true; $i += 2) {
                    $ligne = [];
                    $ligne['utilisateur_id'] = $idUser;
                    $ligne['profil_id']      = $matrice[$i + 1];

                    // Défini les droits associés au profil
                    $bSave = DB::table('profil_utilisateur')->insert($ligne);
                }

                DB::commit();
                $retour = array('idUser' => $idUser, 'save' => $bSave);
            } catch (Exception $e) {
                DB::rollback();
                $retour = array('save' => false);
            }
        }
        else
            $retour = array('save' => false);

        return $retour;
    }

    /**
     * Retourne true si l'utilisateur existe, false sinon
     * @param $email email de l'utilisateur
     * @return array(good => true/false)
     */
    public static function getUserExist($email){
        $user = DB::table('utilisateurs')->where('email', $email)->first(['id']);
        return array('good' => empty($user));
    }
}
