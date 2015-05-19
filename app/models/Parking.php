<?php

class Parking extends BaseModel
{
    protected $table = 'parking';
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

    /**
     * Les utilisateurs du parking
     * @return mixed
     */
    public function utilisateurs()
    {
        return $this->belongsToMany('Utilisateur');
    }

    /**
     * Les calendriers du parking
     * @return mixed
     */
    public function calendriers()
    {
        return $this->hasMany('Calendrier');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/
    /**
     * Les places du parking
     * @param $id : ID parking
     * @return json
     */
    public static function getPlaces($id)
    {
        return Parking::find($id)
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('zone', 'zone.niveau_id', '=', 'niveau.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->select('place.id', 'place.num', 'etat_occupation.is_occupe')
            ->get();
    }

    /**
     * Génère les données JSON pour le treeview.
     *
     * Se base sur Auth::user() pour gérer les droits d'accès aux parking
     */
    public static function getTreeviewParking()
    {
        return Auth::user()->parkings()->with('niveaux.plans')->get();
    }

    /**
     * Calcule le calendrier annuel du parking
     * @param $id : ID parking
     * @param $annee : année concernée
     * @return mixed
     */
    public static function getCalendrier($id, $annee)
    {
        return Parking::find($id)
            ->with(['calendriers' => function ($query) use ($annee) {
                $query->where(DB::raw('YEAR(calendrier.jour)'), '=', $annee)
                ->with('calendrierJour');
            }])
            ->first();
    }
}