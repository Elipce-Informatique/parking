<?php

class Plan extends \Eloquent
{
    protected $table = 'plan';
    public $timestamps = false;
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
}