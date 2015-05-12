<?php

class Capteur extends \Eloquent
{
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * La place du capteur
     * @return mixed
     */
    public function places()
    {
        return $this->hasOne('Place');
    }
}