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
    public function getProfilModule($idProfil){
        /* Un profil est sélectionné */
        if($idProfil != 0) {

//            SELECT m.id, m.traduction, pm.access_level AS etat, pm.profil_id AS IDprofil
//            FROM modules m
//            LEFT JOIN profil_module pm ON pm.module_id = m.id AND pm.profil_id=$idProfil

            /* Récupère tout les modules avec les droits associés au profil */
            $aTabModule =  Module::all(array('id', 'traduction', DB::raw('"visu" as etat')));

            return $aTabModule;
        }
        /* Récupère uniquement les modules */
        else{
            /* Récupère tout les modules uniquement */
            $aTabModule =  Module::all(array('id', 'traduction', DB::raw('"" as etat')));
            $nb = count($aTabModule);

            return $aTabModule;
        }
    }
} 