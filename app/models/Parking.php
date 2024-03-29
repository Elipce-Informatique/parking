<?php

class Parking extends BaseModel
{
    protected $table = 'parking';
    protected $fillable = ['libelle', 'description', 'etat', 'init_mode'];

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

    /**
     * server de com
     * @return mixed
     */
    public function server_com()
    {
        return $this->hasOne('ServerCom');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/

    /**
     * Update le timestamp d'update afficheur
     */
    public function touchAffUpdate()
    {
        $this->last_aff_update = $this->freshTimestamp();
        return $this->save();
    }

    /**
     * Update le timestamp de synchro OK.
     */
    public function touchSynchroOk()
    {
        $this->last_synchro_ok = $this->freshTimestamp();
        return $this->save();
    }

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
        return Auth::user()->parkings()->with(['niveaux.plans' => function ($q) {
            $q->orderBy('plan.libelle');
        }])->get();
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
            ->select('type_place.couleur', DB::raw('parking.libelle AS parking'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('parking.id')
            ->select('type_place.couleur', DB::raw('parking.libelle AS parking'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
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
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), 'type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'))
            ->orderBy('type_place.ordre');

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
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), 'type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->orderBy('type_place.ordre')
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
            ->select('type_place.couleur', DB::raw('plan.libelle AS plan'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('plan.id')
            ->select('type_place.couleur', DB::raw('plan.libelle AS plan'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupGlobal);

        $sub = $totalGlobal; // Eloquent Builder instance

        $totalGlobal = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.couleur', 'sub.plan', 'sub.libelle', 'sub.type', 'sub.nb')
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
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), DB::raw('plan.libelle AS plan'), 'type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

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
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), DB::raw('plan.libelle AS plan'), 'type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupDetail);

        $sub = $totalDetail; // Eloquent Builder instance

        $totalDetail = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.couleur', 'sub.ordre', 'sub.type_place_id', 'sub.plan', 'sub.libelle', 'sub.type', 'sub.nb')
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
        // GLOBAL PAR ZONE BLOC 3
        $groupGlobal = DB::table('parking')
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('zone.id', 'etat_occupation.is_occupe')
            ->select('type_place.couleur', DB::raw('zone.libelle AS zone'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalGlobal = DB::table('parking')
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING

            ->groupBy('zone.id')
            ->select('type_place.couleur', DB::raw('zone.libelle AS zone'), DB::raw('\'TOTAL\' AS libelle'), DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupGlobal);

        $sub = $totalGlobal; // Eloquent Builder instance

        $totalGlobal = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.couleur', 'sub.zone', 'sub.libelle', 'sub.type', 'sub.nb')
            ->orderBy('sub.zone', 'asc')
            ->orderBy('sub.type', 'asc')
            ->get();


        $whereKeys = "('" . implode($types_places, "','") . "')";

        // DETAIL PAR PLAN BLOC 2
        $groupDetail = DB::table('parking')
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('zone.id', 'place.type_place_id', 'etat_occupation.is_occupe')
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), DB::raw('zone.libelle AS zone'), 'type_place.libelle', DB::raw('is_occupe AS type'), DB::raw('COUNT(*) AS nb'));

        $totalDetail = DB::table('parking')
            ->join('niveau', 'parking.id', '=', 'niveau.parking_id')
            ->join('plan', 'plan.niveau_id', '=', 'niveau.id')
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->join('type_place', 'place.type_place_id', '=', 'type_place.id')
            ->join('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('parking.id', '=', $parkId)// ON SE PLACE SUR LE PARKING
            ->whereRaw('etat_occupation.type_place_id in ' . $whereKeys)
            ->groupBy('zone.id', 'place.type_place_id')
            ->select('type_place.couleur', 'type_place.ordre', DB::raw('type_place.id AS type_place_id'), DB::raw('zone.libelle AS zone'), 'type_place.libelle', DB::raw('2 AS type'), DB::raw('COUNT(*) AS nb'))
            ->unionAll($groupDetail);

        $sub = $totalDetail; // Eloquent Builder instance

        $totalDetail = DB::table(DB::raw("({$sub->toSql()}) as sub"))
            ->mergeBindings($sub)// you need to get underlying Query Builder
            ->select('sub.couleur', 'sub.ordre', 'sub.type_place_id', 'sub.zone', 'sub.libelle', 'sub.type', 'sub.nb')
            ->orderBy('sub.zone', 'asc')
            ->orderBy('sub.type', 'asc')
            ->get();


        return [$totalGlobal, $totalDetail];
    }


    /**
     * calcule si le libelle passé en param existe déjà
     * @param $libelle : libellé à vérifier
     * @param string $id : ID à ne pas prendre en compte lors de la vérif (mode édition)
     * @return bool
     */
    public static function isLibelleExists($libelle, $id = '')
    {
        $and = $id === '' ? '' : "AND id <> $id";
        $result = Parking::whereRaw("libelle = '$libelle' $and")
            ->count();
//        dd($result);
        return ($result > 0);
    }

    /**
     * Créé un parking à partir des POST
     * @param $fields
     * @return array
     */
    public static function createParking($fields)
    {
//        Log::debug(print_r($fields, true));

        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'upload' => true
        ];

        // Début transaction
        DB::beginTransaction();

        // Le jour n'existe pas en BDD
        if (!Parking::isLibelleExists($fields['libelle'])) {

            // Essai d'enregistrement
            try {
                // Création du parking
                $model = Parking::create($fields);

                // Uploaded file logo
                if (Input::hasFile('logo')) {
                    // logo
                    $fileCourant = Input::file('logo');
                    // Extension
                    $extFile = $fileCourant->getClientOriginalExtension();
                    //  Nom du fichier (ID + extension)
                    $fileName = $model->id . '.' . $extFile;
                    // Sauvegarde dans "documents/logo_parking"
                    $fileCourant->move(storage_path() . '/documents/logo_parking', $fileName);
                    // Mise à jour du champ en base de donnée
                    $model->logo = $fileName;
                    $model->save();

                } // Le fichier n'existe pas
                else {
                    if($fields['logo'] != '') {
                        Log::error('Erreur enregistrement logo parking. ');
                        $retour['save'] = false;
                        $retour['upload'] = false;
                    }
                }

                // Association des users
                if (isset($fields['utilisateurs']) && $fields['utilisateurs'] !== '') {
                    $model->utilisateurs()->attach(explode('[-]', $fields['utilisateurs']));
                } // No user
                else {
                    $model->utilisateurs()->attach(Auth::user());
                }
                // CRéation server_com
//                Log::debug('FIELDS ' . print_r($fields, true));
                $keysServCom = [
                    'protocol_version' => '',
                    'protocol_port' => '',
                    'software_name' => '',
                    'software_version' => '',
                    'software_build_date' => '',
                    'software_os' => ''
                ];
                $fieldsServCom = array_intersect_key($fields, $keysServCom);
                $fieldsServCom['parking_id'] = $model->id;
//                Log::debug('FIELDS SERV COM ' . print_r($fieldsServCom, true));
                ServerCom::create($fieldsServCom);

                // Le model complet
                $retour['model'] = Parking::with('utilisateurs')
                    ->with('server_com')
                    ->where('parking.id', '=', $model->id)
                    ->first();

            } catch (Exception $e) {
                Log::debug($e->getMessage());
                $retour['save'] = false;
                $retour['errorBdd'] = true;
            }
        } // Le parking existe déjà en BDD
        else {
            $retour['save'] = false;
        }

        // Enregistrement BDD
        if ($retour['save']) {
            DB::commit();
        } // Enregistrement KO
        else {
            DB::rollBack();
        }

        return $retour;
    }


    /**
     * Update parking
     *
     * @param  int $id : ID du parking à modifier
     * @return Response
     */
    public static function updateParking($id)
    {
        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'upload' => true
        ];

        // Les données passées en PUT
        $fields = Input::all();
//        Log::debug("UPDATE FIELDS " . print_r($fields, true));

        // Début transaction
        DB::beginTransaction();

        try {

            // Le libellé parking est unique
            if (!Parking::isLibelleExists($fields['libelle'], $id)) {
                // Parking à modifier
                $model = Parking::find($id);
                // Champs filtrés
                $filteredFields = [];
                // Parcours de tous les champs
                foreach ($model->getFillable() as $key) {
                    // On ne garde que les clés qui nous interessent
                    if (isset($fields[$key])) {
                        $filteredFields[$key] = $fields[$key];
                    }
                }

                // Update parking
                $model->update($filteredFields);

                // Modification de logo
                if ($fields['logo'] != '') {
                    // Upload
                    if (Input::file('logo')->isValid()) {
                        // Logo
                        $fileCourant = Input::file('logo');
                        // Extension
                        $extFile = $fileCourant->getClientOriginalExtension();
                        //  Nom du fichier (ID + extension)
                        $fileName = $model->id . '.' . $extFile;
                        // Sauvegarde dans "documents/logo_parking"
                        $fileCourant->move(storage_path() . '/documents/logo_parking', $fileName);
                        // Mise à jour du champ en base de donnée
                        $model->logo = $fileName;
                        $model->save();

                    } // Le fichier n'a pas été POST
                    else {
                        Log::error('Erreur enregistrement logo parking. ');
                        $retour['save'] = false;
                        $retour['upload'] = false;
                    }
                }
                // else mode edition sans modification de fichier

                // Les users avant insertion
                $usersBefore = $model->utilisateurs()->get();

                // Association des users
                if (isset($fields['utilisateurs']) && $fields['utilisateurs'] !== '') {
                    // Utilisteurs après validation
                    $usersAfter = explode('[-]', $fields['utilisateurs']);

                    // Parcours des users avant insertion
                    foreach ($usersBefore as $user) {
                        // Utilisateur plus associé
                        if (!in_array($user->id, $usersAfter)) {
                            $model->utilisateurs()->detach($user->id);
                        } // utilisateur déjà associé
                        else {
                            $key = array_search($user->id, $usersAfter);
                            unset($usersAfter[$key]);
                        }
                    }

                    // Users à ajouter
                    if (count($usersAfter) > 0) {
                        $model->utilisateurs()->attach($usersAfter);
                    }

                } // Plus d'utilisateurs liés (seulement le connecté)
                else {
                    foreach ($usersBefore as $userB) {
                        $model->utilisateurs()->detach($userB->id);
                    }
                    // Utilisateur connecté
                    $model->utilisateurs()->attach(Auth::user());
                }

                // Serveur com
                $modelServCom = ServerCom::where('parking_id', '=', $model->id)
                    ->first();

                $filteredFields = [];
                foreach ($modelServCom->getFillable() as $key) {
                    // On ne garde que les clés qui nous interessent
                    if (isset($fields[$key])) {
                        $filteredFields[$key] = $fields[$key];
                    }
                }
                if (count($filteredFields) > 0) {
                    $modelServCom->update($filteredFields);
                }

                // Le model complet
                $retour['model'] = Parking::with('utilisateurs')
                    ->with('server_com')
                    ->where('parking.id', '=', $id)
                    ->first();
            } // Le parking existe
            else {
                $retour['save'] = false;
                Log::error("Le parking " . $fields['libelle'] . " existe déjà. ");
            }

        } catch (Exception $e) {
            Log::error("Erreur store parking. " . $e->getMessage());
            $retour['errorBdd'] = true;
            $retour['save'] = false;
        }

        // Enregistrement BDD
        if ($retour['save']) {
            DB::commit();
        } // Enregistrement KO
        else {
            DB::rollBack();
        }

        return $retour;
    }

}