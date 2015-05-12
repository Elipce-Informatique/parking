<?php

class TypeAfficheur extends \Eloquent
{
    protected $table = 'type_afficheur';
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