<?php

class Niveau extends BaseModel
{
    protected $table = 'niveau';
    protected $fillable = ['libelle','description','parking_id'];

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
        return $this->hasMany('JournalEquipementPlan');
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

    /**
     * calcule si le libelle passé en param existe déjà
     * @param $parkingId: ID parking
     * @param $libelle: libellé à vérifier
     * @param string $id: ID à ne pas prendre en compte lors de la vérif (mode édition)
     * @return bool
     */
    public static function isLibelleExists($parkingId, $libelle, $id=''){
        $and = $id === '' ? '' : "AND id <> $id";
        $result = Niveau::whereRaw("libelle = '$libelle' AND parking_id = '$parkingId' $and")
            ->count();
//        dd($result);
        return ($result > 0);
    }

    /**
     * Tous les plans du niveau
     * @param $id: ID nivreau
     * @return mixed
     */
    public static function getPlans($id){
        return Niveau::where('id', '=', $id)
            ->with('plans')
            ->first();
    }

}