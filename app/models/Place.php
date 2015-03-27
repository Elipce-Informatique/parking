<?php

class Place extends \Eloquent
{
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * L'allée de la place :
     * Inverse de la relation de l'allée
     * @return mixed
     */
    public function allee()
    {
        return $this->belongsTo('Allee');
    }

    /**
     * Le type de la place :
     * Inverse de la relation du type de la place
     * @return mixed
     */
    public function type_place()
    {
        return $this->belongsTo('Type_place');
    }

    /**
     * Le type de la place :
     * Inverse de la relation du type de la place
     * @return mixed
     */
    public function capteur()
    {
        return $this->belongsTo('Capteur');
    }
}