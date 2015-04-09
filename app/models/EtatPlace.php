<?php

class EtatPlace extends \Eloquent
{
    protected $table = 'etat_place';
    public $timestamps = false;
    protected $fillable = [];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    /**
     * Les états d'occupation associés à cet état de place
     * @return mixed
     */
    public function etats_occupations()
    {
        return $this->hasMany('EtatsDoccupation');
    }


}