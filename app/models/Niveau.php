<?php

class Niveau extends \Eloquent
{
    protected $table = 'niveau';
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les plans du niveau
     * @return mixed
     */
    public function plans()
    {
        return $this->hasMany('Plan');
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


    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/
    /**
     * Les places du niveau
     * @param $id : ID du niveau
     * @return mixed
     */
    public static function getPlaces($id)
    {
        return Niveau::find($id)
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->get();
    }

    /**
     * La place max du niveau $id
     * @param $id : ID du niveau
     * @return int: numéro de place
     */
    public static function getMaxPlace($id)
    {
        return Niveau::find($id)
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->max('place.num');
    }
}