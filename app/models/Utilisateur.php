<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class Utilisateur extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

    public $timestamps = false;
    protected $fillable = ['nom', 'prenom', 'mail', 'date_naissance', 'login', 'pwd'];

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
	protected $hidden = array('pwd', 'first_conn');

}
