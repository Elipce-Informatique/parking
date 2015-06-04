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
        //
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
        //
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Parking::find($id);
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
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
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
        $retour = [
            'b1' => [],
            'b2' => [],
            'b3' => [],
        ];

        // -------------------------------------------------------------------------------------------------------------
        // RÉCUPÉRATION DES PRÉFÉRENCES DE L'UTILISATEUR
        // -------------------------------------------------------------------------------------------------------------
        $preferences = Auth::user()->getPreferences(['bloc_1', 'bloc_2', 'bloc_3']);
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

        Log::debug('-------------------------------------------- Types par blocks ------------------------------------');
        Log::debug('BLOCK 1 -> ' . print_r($typesBlock1, true));
        Log::debug('BLOCK 2 -> ' . print_r($typesBlock2, true));
        Log::debug('BLOCK 3 -> ' . print_r($typesBlock3, true));
        Log::debug('--------------------------------------------------------------------------------------------------');

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 1 - PARKING
        // -------------------------------------------------------------------------------------------------------------

        // GLOBAL PARKING
        $bloc1 = Parking::getTabBordBlock1($parkId, $typesBlock1);

        // GLOBAL PAR TYPE #####################
        $temp = [];
        foreach ($bloc1[1] AS $ligne) {
            switch ($ligne->type) {
                // places libres
                case '0':
                    $temp[$ligne->type_place_id]['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp[$ligne->type_place_id]['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp[$ligne->type_place_id]['total'] = $ligne->nb;
                    $temp[$ligne->type_place_id]['libelle'] = $ligne->libelle;
                    break;
            }
        }
        $retour['b1'] = $temp;

        // PARCOURS DES DONNÉES GLOBALES SANS FILTRE SUR LES TYPES #####################
        $temp = [
            'libelle' => Lang::get('supervision.tab_bord.global_parking')
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
                    $temp[$ligne->plan][$ligne->type_place_id]['libre'] = $ligne->nb;
                    break;
                // places occupés
                case '1':
                    $temp[$ligne->plan][$ligne->type_place_id]['occupee'] = $ligne->nb;
                    break;
                // somme totale
                case '2':
                    $temp[$ligne->plan][$ligne->type_place_id]['total'] = $ligne->nb;
                    $temp[$ligne->plan][$ligne->type_place_id]['libelle'] = $ligne->libelle;
                    break;
            }
        }
        $retour['b2'] = $temp;

        // GLOBAL PAR PLANS SANS FILTRE SUR LES TYPES DE PLACES

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 3 - ZONES
        // -------------------------------------------------------------------------------------------------------------

        // GLOBAL PAR ZONES

        // GLOBAL PAR ZONES PAR TYPE


        return $retour;
    }


}
