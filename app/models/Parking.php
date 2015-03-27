<?php

class Parking extends \Eloquent
{
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Les niveaux du parking
     * @return mixed
     */
    public function niveaux()
    {
        return $this->hasMany('Niveau');
    }
}