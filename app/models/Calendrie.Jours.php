<?php
/**
 * Created by PhpStorm.
 * User: vivian
 * Date: 19/02/2015
 * Time: 15:14
 */

class CalendrierJours extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamp = false;

    protected $fillable = ['jour'];


    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function modules()
    {
        return $this->belongsToMany('Module', 'profil_module')->withPivot(['access_level']);
    }

}