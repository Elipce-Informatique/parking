<?php

class JournalEquipementParking extends \Eloquent
{
    protected $fillable = [];
    protected $talbe = "journal_equipement_parking";
    public $timestamps = true;


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le parking de cette entrée de journal
     * @return mixed
     */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }

    /**
     * Le place de cette entrée de journal
     * @return mixed
     */
    public function place()
    {
        return $this->belongsTo('Place');
    }

    /**
     * Le afficheur de cette entrée de journal
     * @return mixed
     */
    public function afficheur()
    {
        return $this->belongsTo('Afficheur');
    }

    /**
     * Le afficheur de cette entrée de journal
     * @return mixed
     */
    public function etat_occupation()
    {
        return $this->belongsTo('EtatsDoccupation');
    }
}