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

    /**
     * Les concentrateurs du parking
     * @return mixed
     */
    public function concentrateurs()
    {
        return $this->hasMany('Concentrateur');
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

    /**
     * BLOCK_1
     * Retourne les statistiques globales des places du parking:
     * - nb places totales
     * - nb places libres
     * - nb places occupées
     *
     * avec le filtre sur les types de places (comme les préférences utilisateur)
     *
     * @param $parkId
     * @param $types_places : Les types de places à sélectionner. Si non renseigné, ne prend que le global
     *
     * @return array
     */
    public static function getTabBordBlock1($parkId, $types_places = [])
    {
        // GLOBAL TOTAL
        $groupGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('etat_occupation.is_occupe')
            ->select(DB::raw('\'TOTAL\' AS libelle'), DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('parking.id')
            ->select(DB::raw('\'TOTAL\' AS libelle'), DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupGlobal)->get();


        $whereKeys = "('" . implode($types_places, "','") . "')";

        // DETAIL TOTAL
        $groupDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->leftJoin('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('parking.id', 'place.type_place_id', 'etat_occupation.is_occupe')
            ->orderBy('type_place.id')
            ->select(DB::raw('type_place.id AS type_place_id'), 'type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->leftJoin('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('parking.id', 'place.type_place_id')
            ->orderBy('type_place.id')
            ->select(DB::raw('type_place.id AS type_place_id'), 'type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupDetail)->get();

        return [$totalGlobal, $totalDetail];
    }

    /**
     * BLOCK_2
     * Retourne les statistiques GROUPÉS PAR PLAN
     * 1 ligne récap par plan
     * + 1 ligne par type de place et par plan
     *
     *
     * @param $parkId
     * @param $types_places : Les types de places à sélectionner. Si non renseigné, ne prend que le global
     *
     * @return array
     */
    public static function getTabBordBlock2($parkId, $types_places = [])
    {
        // GLOBAL PAR PLAN BLOC 2
        $groupGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('plan.id', 'etat_occupation.is_occupe')
            ->select(DB::raw('plan.id AS plan'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('plan.id')
            ->select(DB::raw('plan.id AS plan'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupGlobal);

        $sub = $totalGlobal; // Eloquent Builder instance

        $totalGlobal = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.plan', 'sub.libelle', 'sub.type', 'sub.nb')
            ->orderBy('sub.plan', 'asc')
            ->orderBy('sub.type', 'asc')
            ->get();


        $whereKeys = "('" . implode($types_places, "','") . "')";

        // DETAIL PAR PLAN BLOC 2
        $groupDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('plan.id', 'place.type_place_id', 'etat_occupation.is_occupe')
            ->select(DB::raw('type_place.id AS type_place_id'), DB::raw('plan.id AS plan'), 'type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('plan.id', 'place.type_place_id')
            ->select(DB::raw('type_place.id AS type_place_id'), DB::raw('plan.id AS plan'), 'type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupDetail);

        $sub = $totalDetail; // Eloquent Builder instance

        $totalDetail = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.type_place_id', 'sub.plan', 'sub.libelle', 'sub.type', 'sub.nb')
            ->orderBy('sub.plan', 'asc')
            ->orderBy('sub.type', 'asc')
            ->get();


        return [$totalGlobal, $totalDetail];
    }

    /**
     * BLOCK_3
     * Retourne les statistiques GROUPÉS PAR ZONES
     * - nb places totales
     * - nb places libres
     * - nb places occupées
     *
     * @param $parkId
     * @param $types_places : Les types de places à sélectionner. Si non renseigné, ne prend que le global
     *
     * @return array
     */
    public static function getTabBordBlock3($parkId, $types_places = [])
    {
        // GLOBAL
        $groupGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->groupBy('etat_occupation.is_occupe')
            ->select('type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->groupBy('parking.id')
            ->select('type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupGlobal)->get();

        $whereKeys = "('" . implode($types_places, "','") . "')";

        // DETAIL
        $groupDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('parking.id', 'place.type_place_id', 'etat_occupation.is_occupe')
            ->select('type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalDetail = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('parking.id', 'place.type_place_id')
            ->select('type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupDetail)->get();

        return [$totalGlobal, $totalDetail];
    }

}