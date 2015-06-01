<?php

class PlacesController extends \BaseController
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
        $places = json_decode(Input::get('places'), true);
        return ['retour' => Place::createPlaces($places)];

    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
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
     * Attache un capteur à la place désignée par l'id
     *
     * Attend un param POST 'capteur_id'
     * @param $id
     *
     * @return etat insertion
     */
    public function setCapteur($id)
    {
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null
        ];

        $capteur_id = input::get('capteur_id');
        $place = Place::find($id);
        $capteur = Capteur::find($capteur_id);

        try {
            $place->capteur()->associate($capteur);
            $place->save();
            $retour['model'] = Place::with('capteur.bus.concentrateur')->find($id);

            Log::debug('PASS ATTACHE PLACE CAPTEUR');
            Log::debug(print_r($retour, true));

            // OK
            return $retour;

        } catch (Exception $e) {
            $retour['save'] = false;
            $retour['errorBdd'] = true;

            // KO
            return $retour;
        }

    }


}
