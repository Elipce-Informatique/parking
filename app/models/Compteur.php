<?php

class Compteur extends \Eloquent
{

    protected $table = 'compteur';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les compteurs aggrégés par ce compteur
     * @return mixed
     */
    public function compteurs()
    {
        return $this->belongsToMany('Compteur', 'compteur_compteur', 'compteur_id', 'compteur_fils_id');
    }

    /**
     * Les capteurs associés au compteur (Normalement que pour les compteurs feuilles)
     * @return mixed
     */
    public function capteurs()
    {
        return $this->belongsToMany('Capteur');
    }

    /**
     * Les vues liées à ce compteur
     * @return mixed
     */
    public function vues()
    {
        return $this->hasMany('Vue');
    }

}