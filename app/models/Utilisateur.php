<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class Utilisateur extends Eloquent implements UserInterface, RemindableInterface
{

    use UserTrait, RemindableTrait;

    public $timestamp = false;

    protected $fillable = ['nom', 'email', 'password'];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'utilisateurs';

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = array('password');
    
    /**
     * Calculee la liste de tous les utilisateurs de l'application
     * @return 
     */
    public static function getUtilisateurs(){
       $res = Utilisateur::all(array('id','nom','email'));
       return $res;
    }

}
