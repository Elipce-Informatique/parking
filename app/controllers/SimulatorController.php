<?php

class SimulatorController extends \BaseController
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
     * Libére ou occupe des places de parking sur le plan $id
     *
     * @param  int $id : ID plan
     * @return Response
     */
    public function show($id)
    {
        $retour = true;
        // Toutes les places du parking $id
        $places = Niveau::getPlaces($id);

        // Min et max des places
        $min = 0;
        $max = Niveau::getMaxPlace($id);
//        Log::debug('random max: '.$max);

        // Nb aléatoire de places qui bougent
        $nb = mt_rand(5, 15);

        try {
            DB::beginTransaction();

            // Parcours des places à modifier
            for ($i = 0; $i < $nb; $i++) {
                // Place aléatoire
                $numPlace = mt_rand($min, $max);

                // ID place
                $oPlace = Place::getPlaceFromNum($numPlace, $id);
                $idPlace = $oPlace->id;
//                Log::debug('num place: '.$numPlace. ' id place: '.$idPlace);

                // Etat d'occupation courrant
                $etatCourant = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, $oPlace->is_occupe);

                // Etat d'occupation inverse
                $etatNew = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, !$oPlace->is_occupe);
                if(!$etatNew){
                    $etatNew = $etatCourant;
                }
//                Log::debug('OLD: '.$etatCourant->libelle.' NEW: '.$etatNew->libelle);

                // Modification place
                if (!Place::updatePlace($idPlace, array('etat_occupation_id' => $etatNew->id))) {
                    Log::error('Rollback simulator update place: '.$idPlace);
                    $retour = false;
                    break;
                }
                // Journal
                if (!JournalEquipementPlan::createJournalPlace([
                    'plan_id' => $id,
                    'place_id' => $idPlace,
                    'etat_occupation_id' => null
                ])
                ) {
                    Log::error('Rollback simulator insert journal: '.$idPlace);
                    $retour = false;
                    break;
                }
            }
            // Pas d'exception si on arrive ici
            DB::commit();
        } catch (Exception $e) {
            // Erreur SQL, on log
            Log::error('Rollback simulator !'.$e->getMessage());
            $retour = false;
        }
        // Pas d'insertions
        if(!$retour){
            DB::rollBack();
        }
        return json_encode($retour);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public
    function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public
    function update($id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public
    function destroy($id)
    {
        //
    }


}
