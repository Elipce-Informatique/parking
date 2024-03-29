<?php

class ParkingsController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.parking');
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        return json_encode(Parking::createParking(Input::all()));
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return json_encode(Parking::with('utilisateurs')
            ->with('server_com')
            ->where('parking.id', '=', $id)
            ->first());
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        return json_encode(Parking::updateParking($id));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        // Suppression parking
        try {
            ServerCom::where('parking_id', '=', $id)
                ->first()
                ->delete();
            $model = Parking::find($id);
            //  Delete file on the server
            File::delete(storage_path() . '/documents/logo_parking/' . $model->logo);
            // Delete parking in DB
            $model->delete();

            $retour = true;
        } catch (Exception $e) {
            Log::error("Erreur suppression parking $id " . $e->getMessage());
            $retour = false;
        }
        return json_encode($retour);
    }

    /**
     * Récupère la liste des concentrateurs du parking avec toutes les données sous-jacentes (bus et capteurs)
     * @param $id : id du parking
     * @return reponse
     */
    public function getConcentrateurs($id)
    {
        return Concentrateur::with(['buses' => function ($q) {
            $q->with(['capteurs' => function ($q) {
                $q->with('place')->orderBy('adresse');
            }]);
        }])->where('parking_id', '=', $id)
            ->get();
    }

    /**
     * Récupère la liste des afficheurs du parking.
     * @param $parkingId : id du parking
     * @return reponse
     */
    public function getAfficheursLibre($parkingId)
    {
        $afficheurs = DB::table('parking')
            ->join('concentrateur', 'parking.id', '=', 'concentrateur.parking_id')
            ->join('bus', 'concentrateur.id', '=', 'bus.concentrateur_id')
            ->join('afficheur', 'bus.id', '=', 'afficheur.bus_id')
            ->leftJoin('vue', 'afficheur.id', '=', 'vue.afficheur_id')
            ->where('parking.id', '=', $parkingId)
            ->where('afficheur.a_supprimer', '=', '0')
            ->whereNull('vue.id')
            ->select('afficheur.*')
            ->get();
        return $afficheurs;

    }

    /**
     * Récupère la liste des afficheurs du parking.
     * @param $parkingId : id du parking
     * @return reponse
     */
    public function getAfficheursGet($parkingId)
    {
        $afficheurs = DB::table('parking')
            ->join('concentrateur', 'parking.id', '=', 'concentrateur.parking_id')
            ->join('bus', 'concentrateur.id', '=', 'bus.concentrateur_id')
            ->join('afficheur', 'bus.id', '=', 'afficheur.bus_id')
            ->where('parking.id', '=', $parkingId)
            ->where('afficheur.a_supprimer', '=', '0')
            ->whereNull('afficheur.lat', '=', '0')
            ->select('afficheur.*')
            ->get();
        return $afficheurs;

    }

    /**
     * Récupère TOUTES les données du tableau de bord du parking:
     *
     * - Global parking
     * - Global parking par type
     *
     * - Global plan
     * - Global plan par type
     *
     * - Global zone
     * - Global zone par type
     *
     * - TODO Paramètres, d'ordre des barres pour chaque bloc
     * @param $parkId id du parking
     *
     * @return retour
     */
    public function getTableauBordData($parkId)
    {
        // FORMAT GLOBAL DES DONNÉES DE RETOUR?
        $retour = [
            'b1' => array(),
            'b2' => array(),
            'b3' => array(),
            'prefs' => [
                'b1' => [
                    'types' => [],
                    'ordre' => []
                ],
                'b2' => [
                    'types' => [],
                    'ordre' => []
                ],
                'b3' => [
                    'types' => [],
                    'ordre' => []
                ]
            ],
            'types' => [],
        ];

        // -------------------------------------------------------------------------------------------------------------
        // RÉCUPÉRATION DES PRÉFÉRENCES DE L'UTILISATEUR
        // -------------------------------------------------------------------------------------------------------------
        $preferences = Auth::user()->getPreferences(['bloc_1', 'bloc_2', 'bloc_3'], $parkId);
        $preferences = $preferences['preferences'];

        $typesBlock1 = [];
        $typesBlock2 = [];
        $typesBlock3 = [];

        foreach ($preferences AS $pref) {
            switch ($pref->key) {
                case 'bloc_1':
                    $typesBlock1[] = $pref->value;
                    break;
                case 'bloc_2':
                    $typesBlock2[] = $pref->value;
                    break;
                case 'bloc_3':
                    $typesBlock3[] = $pref->value;
                    break;
                default:
                    break;
            }
        }

        $retour['prefs']['b1']['types'] = $typesBlock1;
        $retour['prefs']['b2']['types'] = $typesBlock2;
        $retour['prefs']['b3']['types'] = $typesBlock3;

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 1 - PARKING
        // -------------------------------------------------------------------------------------------------------------

        // GLOBAL PARKING
        $bloc1 = Parking::getTabBordBlock1($parkId, $typesBlock1);
//        dd($parkId);
        try {
            $parkingLibelle = $bloc1[0][0]->parking;
        } catch (Exception $e) {
            return '';
        }

        // GLOBAL PAR TYPE #####################
        $temp = [];
        foreach ($bloc1[1] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $temp[$ligne->ordre]['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp[$ligne->ordre]['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp[$ligne->ordre]['total'] = $ligne->nb;
                    $temp[$ligne->ordre]['libelle'] = $ligne->libelle;
                    $temp[$ligne->ordre]['type_place_id'] = $ligne->type_place_id;
                    $temp[$ligne->ordre]['couleur'] = $ligne->couleur;
                    break;
            }
        }
        $retour['b1'] = $temp;

        // PARCOURS DES DONNÉES GLOBALES SANS FILTRE SUR LES TYPES #####################
        $temp = [
            'libelle' => Lang::get('supervision.tab_bord.global') . ' ' . $parkingLibelle
        ];
        foreach ($bloc1[0] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $temp['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp['total'] = $ligne->nb;

                    break;
            }
        }
        $retour['b1']['TOTAL'] = $temp;

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 2 - PLANS
        // -------------------------------------------------------------------------------------------------------------

        $bloc2 = Parking::getTabBordBlock2($parkId, $typesBlock2);

        // GLOBAL PAR PLAN PAR TYPE #####################
        $temp = [];
        foreach ($bloc2[1] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $temp[$ligne->plan][$ligne->ordre]['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp[$ligne->plan][$ligne->ordre]['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp[$ligne->plan][$ligne->ordre]['total'] = $ligne->nb;
                    $temp[$ligne->plan][$ligne->ordre]['libelle'] = $ligne->libelle;
                    $temp[$ligne->plan][$ligne->ordre]['type_place_id'] = $ligne->type_place_id;
                    $temp[$ligne->plan][$ligne->ordre]['couleur'] = $ligne->couleur;
                    break;
            }
        }
        $retour['b2'] = $temp;

        // GLOBAL PAR PLANS SANS FILTRE SUR LES TYPES DE PLACES
        foreach ($bloc2[0] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $retour['b2'][$ligne->plan]['TOTAL']['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $retour['b2'][$ligne->plan]['TOTAL']['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $retour['b2'][$ligne->plan]['TOTAL']['total'] = $ligne->nb;
                    $retour['b2'][$ligne->plan]['TOTAL']['libelle'] = Lang::get('supervision.tab_bord.global');
                    break;
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 3 - ZONES
        // -------------------------------------------------------------------------------------------------------------

        $bloc3 = Parking::getTabBordBlock3($parkId, $typesBlock3);

        // GLOBAL PAR PLAN PAR TYPE #####################
        $temp = [];
        foreach ($bloc3[1] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $temp[$ligne->zone][$ligne->ordre]['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp[$ligne->zone][$ligne->ordre]['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp[$ligne->zone][$ligne->ordre]['total'] = $ligne->nb;
                    $temp[$ligne->zone][$ligne->ordre]['libelle'] = $ligne->libelle;
                    $temp[$ligne->zone][$ligne->ordre]['type_place_id'] = $ligne->type_place_id;
                    $temp[$ligne->zone][$ligne->ordre]['couleur'] = $ligne->couleur;
                    break;
            }
        }
        $retour['b3'] = $temp;

        // GLOBAL PAR PLANS SANS FILTRE SUR LES TYPES DE PLACES
        foreach ($bloc3[0] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $retour['b3'][$ligne->zone]['TOTAL']['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $retour['b3'][$ligne->zone]['TOTAL']['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $retour['b3'][$ligne->zone]['TOTAL']['total'] = $ligne->nb;
                    $retour['b3'][$ligne->zone]['TOTAL']['libelle'] = Lang::get('supervision.tab_bord.global');
                    break;
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        // FILL IN THE BLANKS - RAJOUT DES TYPES DE PLACES NON RENSEIGNÉS DANS LES DONNÉES RÉELLES
        // -------------------------------------------------------------------------------------------------------------

        $types = TypePlace::getAssocIdType();

        // Retour des types pour les listes à choix multiples
        $retour['types'] = $types;


        // BLOC 1 -------------------------------
        foreach ($typesBlock1 AS $t) {

            $inRetour = false;
            // On recherche le type parmi les résultats
            foreach ($retour['b1'] AS $stat) {
                try {
                    if ($stat['type_place_id'] == $t) {
                        $inRetour = true;
                    }
                } catch (Exception $e) {

                }
            }
            if (!$inRetour) {
                $retour['b1'][$types[$t]->ordre] = [
                    "libelle" => $types[$t]->libelle,
                    "total" => 0,
                    "libre" => 0,
                    "occupee" => 0,
                    "couleur" => $types[$t]->couleur
                ];
            }
        }

        // BLOC 2 -------------------------------
        foreach ($retour['b2'] AS $libellePlan => $plan) {
            // $t -> id du type de place
            foreach ($typesBlock2 AS $t) {

                $inRetour = false;
                // On recherche le type parmi les résultats
                foreach ($plan AS $stat) {
                    try {
                        if ($stat['type_place_id'] == $t) {
                            $inRetour = true;
                        }
                    } catch (Exception $e) {

                    }
                }
                if (!$inRetour) {
                    $retour['b2'][$libellePlan][$types[$t]->ordre] = [
                        "libelle" => $types[$t]->libelle,
                        "total" => 0,
                        "libre" => 0,
                        "occupee" => 0,
                        "couleur" => $types[$t]->couleur
                    ];
                }
            }
        }

        // BLOC 3 -------------------------------
        foreach ($retour['b3'] AS $libelleZone => $zone) {

            //-------------------------
            // $t -> id du type de place
            foreach ($typesBlock3 AS $t) {

                $inRetour = false;
                // On recherche le type parmi les résultats
                foreach ($zone AS $stat) {
                    try {
                        if ($stat['type_place_id'] == $t) {
                            $inRetour = true;
                        }
                    } catch (Exception $e) {

                    }
                }
                if (!$inRetour) {
                    $retour['b3'][$libelleZone][$types[$t]->ordre] = [
                        "libelle" => $types[$t]->libelle,
                        "total" => 0,
                        "libre" => 0,
                        "occupee" => 0,
                        "couleur" => $types[$t]->couleur
                    ];
                }

            }
        }


        return $retour;
    }

    /**
     * Tous les parkings du user
     * @return mixed
     */
    public function all()
    {
        $parks =
            Auth::user()
                ->parkings()
                ->join('server_com', 'server_com.parking_id', '=', 'parking.id')
                ->select([
                    'parking.id',
                    'parking.libelle',
                    'parking.description',
                    'server_com.protocol_port'])
                ->get();

        return json_encode([
            'parkings' => $parks,
            'users' => Utilisateur::orderBy('nom')->orderBy('prenom')->get()
        ]);
    }

    /**
     * Vérifie l'unicité du libellé parking
     * @param $libelle : parking.libelle
     * @param string $id : ID en mode edition
     * @return string
     */
    public function verifLibelle($libelle, $id = '')
    {

        return json_encode(Parking::isLibelleExists($libelle, $id));
    }

    /**
     * Parking initialized from controller
     * @param $id : ID parking
     * @return string
     */
    public function initialized($id)
    {
        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null
        ];

        try {
            $model = Parking::find($id);
            $model->init = '1';
            $model->save();
            $retour['model'] = Parking::with('server_com')
                ->where('parking.id', '=', $id)
                ->first();
        } catch (Exception $e) {
            Log::error('Error set parking.init = 1');
            $retour['errorBdd'] = true;
            $retour['save'] = false;
        }
        return json_encode($retour);
    }

    /**
     * Met à jour le state du parking sans controle
     * @param $id
     * @return array
     */
    public function updateState($id)
    {
        // TODO insert joutrnal_parking
        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null
        ];

        // Les données passées en PUT
        $fields = Input::all();

        try {
            // Parking à modifier
            $model = Parking::find($id);

            // Update parking
            $model->update($fields);

            // Le model complet
            $retour['model'] = $model;

        } catch (Exception $e) {
            Log::error("Erreur updateState parking. " . $e->getMessage());
            $retour['errorBdd'] = true;
            $retour['save'] = false;
        }

        return $retour;
    }

}
