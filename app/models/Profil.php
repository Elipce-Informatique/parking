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
        return
    }
} 