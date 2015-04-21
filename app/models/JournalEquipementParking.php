<?php

class JournalEquipementParking extends \Eloquent
{
    protected $fillable = [];
    protected $table = "journal_equipement_parking";
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

    /*****************************************************************************
     * REQUETES SELECTION ********************************************************
     *****************************************************************************/

    /**
     * Retourne l'historique du parking passé en params
     * @param $parkingId
     * @returns données
     */
    public static function getJournalParking($parkingId)
    {
        return JournalEquipementParking::where('parking_id', '=', $parkingId)->get();
    }

    /**
     *
     * @param $parkingId
     * @param $journalId
     * @return données
     */
    public static function getJournalParkingFromVersion($parkingId, $journalId)
    {
        return JournalEquipementParking::whereParkingId($parkingId)->where('id', '>', $journalId)->get();
    }

    /**
     *
     * @param $parkingId
     * @param $journalId
     * @return données
     */
    public static function getJournalPlacesFromVersion($parkingId, $journalId)
    {
        $placeIds = JournalEquipementParking::whereParkingId($parkingId)->where('id', '>', $journalId)->groupBy('place_id')->lists('place_id');
        return Place::whereIn('id', $placeIds)->with('etat_occupation')->get();
    }

    /**
     *
     * @param $parkingId
     * @param $journalId
     * @return données
     */
    public static function getJournalAfficheurFromVersion($parkingId, $journalId)
    {
        $afficheurId = JournalEquipementParking::whereParkingId($parkingId)->where('id', '>', $journalId)->groupBy('afficheur_id')->lists('afficheur_id');
        return Afficheur::whereIn('id', $afficheurId)->get();
    }


}