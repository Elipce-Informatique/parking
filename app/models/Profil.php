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
        /* Un profil est sélectionné */
        if($idProfil != 0) {
            /* Récupère tout les modules avec les droits associés au profil */
            $aTabModule =  Module::all(array('id', 'traduction', "traduction AS etat" ));
            $aTabModule[0]['etat'] = 0;
            $aTabModule[1]['etat'] = 1;
            $aTabModule[2]['etat'] = 2;
            return $aTabModule;
        }
        else return [];
    }
} 