<?php
/**
 * Created by PhpStorm.
 * User: yann
 * Date: 24/11/2014
 * Time: 10:16
 */

class Profil extends Eloquent {

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
    public static function getProfilModule($idProfil){
        $aTabModule = [];

        /* Récupère tout les modules avec les droits associés au profil */
        if($idProfil != 0) {
            $aTabModule = Module::leftJoin('profil_module', function($join) use($idProfil)
            {
                $join->on('profil_module.module_id', '=', 'modules.id')->orOn('profil_module.profil_id', '=', DB::raw($idProfil));
            })
                ->groupBy('modules.id')
            ->get(['modules.id', 'modules.traduction', 'profil_module.access_level']);
        }
        /* Récupère uniquement les modules */
        else
            $aTabModule =  Module::all(array('id', 'traduction', DB::raw('"null" as etat')));

        return $aTabModule;
    }
} 