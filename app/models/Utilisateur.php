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
    protected $hidden = array('password');

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
        return $this->belongsToMany('Utilisateur', 'module_module', 'fils_id', 'parent_id');
    }

    public function parent(){
        if($this->parent_id !== null && $this->parent_id > 0){
            return $this->belongsToMany('Utilisateur', 'module_module', 'parent_id', 'fils_id');
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
     * Calculee la liste de tous les utilisateurs de l'application
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUtilisateurs(){
       $res = Utilisateur::all(array('id','nom','email'));
       return $res;
    }

}
