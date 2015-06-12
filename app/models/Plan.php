<?php

class Plan extends BaseModel
{
    protected $table = 'plan';
    protected $fillable = [
        'libelle',
        'description',
        'url',
        'niveau_id',
    ];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Le niveau du plan
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
    }

    /**
     * Les zones du plan
     * @return mixed
     */
    public function zones()
    {
        return $this->hasMany('Zone');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/

    /**
     * Les places du plan
     * @param $id : ID du plan
     * @return mixed
     */
    public static function getPlaces($id)
    {
        return Plan::where('plan.id', '=', $id)
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->get();
    }


    /**
     * La place max du plan $id
     * @param $id : ID du niveau
     * @return int: numéro de place
     */
    public static function getMaxPlace($id)
    {
        return Plan::where('plan.id', '=', $id)
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->max('place.num');
    }


    /**
     * La place min du plan $id
     * @param $id : ID du niveau
     * @return int: numéro de place
     */
    public static function getMinPlace($id)
    {
        return Plan::where('plan.id', '=', $id)
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->min('place.num');
    }
}