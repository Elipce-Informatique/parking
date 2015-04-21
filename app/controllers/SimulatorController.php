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
     * Libére ou occupe des places de parking sur le niveau $id
     *
     * @param  int $id : ID niveau
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

        // Nb aléatoire de places qui bougent
        $nb = mt_rand(5, 15);

//        return Place::getPlaceFromNum(58, 1);

        try {
            DB::beginTransaction();
            Log::debug('nb places :'.$nb);
            // Parcours des places à modifier
            for ($i = 0; $i < $nb; $i++) {
                // Place aléatoire
                $numPlace = mt_rand($min, $max);
                Log::debug('num place'. $numPlace);
                // ID place
                $idPlace = Place::getPlaceFromNum($numPlace, $id)->id;
                Log::debug('id place'. $idPlace);
                // Modification place
                // TODO calculer l'état d'occupation
                if (!Place::updatePlace($idPlace, array('etat_occupation_id' => 11))) {
                    DB::rollBack();
                    $retour = false;
                }
                // Journal
                if (!JournalEquipementNiveau::createJournalPlace(array(
                    'niveau_id' => $id,
                    'place_id' => $idPlace,
                    'etat_occupation_id' => null
                ))
                ) {
                    DB::rollBack();
                    $retour = false;
                }
            }
            // Pas d'exception si on arrive ici
            DB::commit();
        } catch (Exception $e) {
            // Erreur SQL, on log
            Log::error('Rollback simulator !'.print_r($e,true));
            DB::rollBack();
            $retour = false;
        }
        if($retour){
            dd('OK');
        }
        else{
            dd('KO');
        }
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
