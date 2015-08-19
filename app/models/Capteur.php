<?php

class Capteur extends BaseModel
{
    protected $table = 'capteur';
    protected $guarded = ['id'];


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * La bus dans lequel se trouve le capteur
     * @return mixed
     */
    public function bus()
    {
        return $this->belongsTo('Buses');
    }

    /**
     * La place du capteur
     * @return mixed
     */
    public function place()
    {
        return $this->hasOne('Place');
    }

    /**
     * L'état courant du capteur
     * @return mixed
     */
    public function etat_capteur()
    {
        return $this->belongsTo('EtatCapteur');
    }

    /**
     * Les compteurs dans lesquels est comptabilisé ce capteur
     * @return mixed
     */
    public function compteurs()
    {
        return $this->belongsToMany('Compteur');
    }
}