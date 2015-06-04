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
        $retour = [];

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

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 1 - PARKING
        // -------------------------------------------------------------------------------------------------------------

        // GLOBAL PARKING
        $retour = Parking::getTabBordBlock1($parkId, $typesBlock1);


        // GLOBAL PAR TYPE

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 2 - PLANS
        // -------------------------------------------------------------------------------------------------------------

        $retour = Parking::getTabBordBlock2($parkId, $typesBlock2);
        // GLOBAL PAR PLANS

        // GLOBAL PAR PLANS PAR TYPE

        // -------------------------------------------------------------------------------------------------------------
        // BLOCK 3 - ZONES
        // -------------------------------------------------------------------------------------------------------------

        // GLOBAL PAR ZONES

        // GLOBAL PAR ZONES PAR TYPE


        return $retour;
    }


}
