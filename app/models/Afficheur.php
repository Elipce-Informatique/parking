<?php

class Afficheur extends \Eloquent
{
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le niveau de l'afficheur
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
    }

    /**
     * Le type de l'afficheur
     * @return mixed
     */
    public function type()
    {
        return $this->belongsTo('Type_afficheur');
    }
}