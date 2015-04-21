<?php

class Niveau extends \Eloquent
{
    protected $table = 'niveau';
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les zones du niveau
     * @return mixed
     */
    public function zones()
    {
        return $this->hasMany('Zone');
    }

    /**
     * Les zones du niveau
     * @return mixed
     */
    public function afficheurs()
    {
        return $this->hasMany('Afficheur');
    }

    /**
     * Le parking du niveau :
     * Inverse de la relation du parking
     * @return mixed
     */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }

    /**
     * Le journal equipement du parking
     * @return mixed
     */
    public function journal_equipement()
    {
        return $this->hasMany('JournalEquipementNiveau');
    }
}