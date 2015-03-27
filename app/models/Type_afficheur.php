<?php

class Type_afficheur extends \Eloquent
{
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les afficheurs du type d'afficheur
     * @return mixed
     */
    public function afficheurs()
    {
        return $this->hasMany('Afficheur');
    }
}