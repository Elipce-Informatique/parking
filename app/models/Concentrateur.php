<?php

class Concentrateur extends \Eloquent {
    protected $table = 'concentrateur';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * La bus dans lequel se trouve le capteur
     * @return mixed
     */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }

    /**
     * Les buses du concentrateur
     * @return mixed
     */
    public function buses()
    {
        return $this->hasMany('Buses');
    }


    /**
     * Les afficheurs du concentrateur
     * @return mixed
     */
    public function afficheurs()
    {
        return $this->hasMany('Afficheur');
    }

}