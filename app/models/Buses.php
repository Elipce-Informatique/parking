<?php

class Buses extends \Eloquent {
    protected $table = 'bus';
    protected $guarded = ['id'];


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * La concentrateur dans lequel se trouve le bus
     * @return mixed
     */
    public function concentrateur()
    {
        return $this->belongsTo('Concentrateur');
    }

    /**
     * Les capteurs du bus
     * @return mixed
     */
    public function capteurs()
    {
        return $this->hasMany('Capteur', 'bus_id', 'id');
    }

    /**
     * Les afficheurs du bus
     * @return mixed
     */
    public function afficheurs()
    {
        return $this->hasMany('Afficheur');
    }
}