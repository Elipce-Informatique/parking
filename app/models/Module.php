<?php
/**
 * Created by PhpStorm.
 * User: yann
 * Date: 24/11/2014
 * Time: 10:16
 */

class Module extends Eloquent {

   /*
   |--------------------------------------------------------------------------
   | ATTRIBUTS
   |--------------------------------------------------------------------------
   */
    public $timestamp = false;

    protected $fillable = ['traduction', 'is_menu'];


    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function profils()
    {
        return $this->belongsToMany('Profil');
    }

    public function fils() {
        return $this->belongsToMany('Module', 'module_module', 'fils_id', 'parent_id');
    }

    public function parent(){
        if($this->parent_id !== null && $this->parent_id > 0){
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

} 