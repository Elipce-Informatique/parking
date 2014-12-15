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

    protected $fillable = ['nom', 'email', 'password'];

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
        $res = Utilisateur::all(array('id', 'nom', 'email', DB::raw('email as mail2'), DB::raw('email as mail3')));
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


}
