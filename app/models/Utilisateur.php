<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class Utilisateur extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

    public $timestamps = false;
    protected $fillable = ['id', 'nom', 'prenom', 'email', 'date_naissance', 'login', 'password', 'first_conn'];

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'utilisateur';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'first_conn');

}
