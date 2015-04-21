<?php

class Parking extends \Eloquent
{
    protected $table = 'parking';
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Les niveaux du parking
     * @return mixed
     */
    public function niveaux()
    {
        return $this->hasMany('Niveau');
    }
    
    public static function getPlaces($id){
        return  Parking::find($id)
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('zone', 'zone.niveau_id', '=', 'niveau.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->get();
    }
}