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
    public function getMenuTopItems(){
        $modules = Auth::user()
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('utilisateurs.id', Auth::user()->id)
            ->whereNull('module_module.parent_id')
            ->groupBy('modules.id')
            ->get(['modules.*']);
        return $modules;
    }

    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER STATIQUES
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
