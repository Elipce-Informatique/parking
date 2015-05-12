<?php

/**
 * Created by PhpStorm.
 * User: yann
 * Date: 24/11/2014
 * Time: 10:16
 */
class Module extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */

    protected $fillable = ['traduction', 'is_menu'];


    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function profils()
    {
        return $this->belongsToMany('Profil', 'profil_module')->withPivot(['access_level']);
    }

    public function fils()
    {
        return $this->belongsToMany('Module', 'module_module', 'fils_id', 'parent_id');
    }

    public function parent()
    {
        if ($this->parent_id !== null && $this->parent_id > 0) {
            return $this->belongsToMany('Module', 'module_module', 'parent_id', 'fils_id');
        } else {
            return null;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER
    |--------------------------------------------------------------------------
    */
    /**
     * Récupère les items du menu Top pour l'utilisateur authentifié
     */
    public static function getTopMenuItems()
    {
        $user = Auth::user();

    }

    /**
     * Récupère les items de menu
     * @param array $tabRes
     * @param $idParent
     */
    public static function getChildrenModulesRecursifWithDroitsForMenu(array &$tabRes, $idParent, $idUtilisateur)
    {
        $res = DB::table('utilisateurs')
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('utilisateurs.id', $idUtilisateur)
            ->where('module_module.parent_id', $idParent)
            ->where('module_module.is_menu', 1)
            ->distinct()
            ->get(['modules.*']);

        if (count($res) > 0) {
            foreach ($res as $i => $module) {
                $module->children = [];
                $tabRes[$i] = $module;
                $idModuleCourrant = $module->id;
                Module::getChildrenModulesRecursifWithDroitsForMenu($tabRes[$i]->children, $idModuleCourrant, $idUtilisateur);
            }
        }
    }

    public static function getTopLevelParentModuleFromUrl($url)
    {
        $mod = Module::where('url', $url)->first();
        if ($mod) {
            Module::getTopLevelParentModuleRecursive($mod);
            return $mod;
        }
        return null;
    }

    public static function getTopLevelParentModuleRecursive(&$mod)
    {
        $nextMod = DB::table('modules')
            ->join('module_module', 'module_module.parent_id', '=', 'modules.id')
            ->where('module_module.fils_id', $mod->id)
            ->where('module_module.is_menu', 1)
            ->first(['modules.*']);
        if ($nextMod) {
            $mod = $nextMod;
            Module::getTopLevelParentModuleRecursive($mod);
        }

    }

    /**
     * Retourne l'id du module en top de hiérarchie en fonction de l'url passée
     *
     * @param $url : url du module en base de données
     * @return l'id du parent le plus haut si le module existe, null sinon
     */
    public static function getIdEnteteFromUrl($url)
    {
        $mod = Module::where('url', $url)->get(['id'])->first();
        if ($mod) {
            return $mod->id;
        }
        return null;
    }
} 