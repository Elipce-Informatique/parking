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
     * Remove the specified resources from storage.
     *
     * @return Response
     */
    public function destroyMany()
    {
        Log::debug('destroyMany, avec ces données : ' . print_r(Input::all(), true));
        $ids = explode(',', Input::get('ids'));
        $action = Place::deletePlaces($ids);
        $retour = [
            'save' => $action,
            'errorBdd' => !$action,
            'model' => null,
            'doublon' => false
        ];
        return $retour;
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
        // Préparation retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'doublon' => false
        ];
        try {
            // RÉCUP DES INFOS POUR L'UPDATE
            $all = Input::all();
            $capteur_id = $all['capteur_id'];
            $isModif = $all['mode_modif'];
            $place = Place::find($id);
            $capteur = Capteur::find($capteur_id);

            $capteur_id_precedent = $place->capteur_id;

            // MODE MODIF
            if ($isModif) {
                $place->capteur()->associate($capteur);
                $place->save();
                $retour['model'] = Place::with('capteur.bus.concentrateur')->find($id);
            } // MODE AFFECTATION KO CAR PLACE DÉJÀ AFFECTÉE
            else if ($capteur_id_precedent != null) {
                $retour['save'] = false;
                $retour['doublon'] = true;
            } // MODE AFFECTATION OK
            else {
                $place->capteur()->associate($capteur);
                $place->save();
                $retour['model'] = Place::with('capteur.bus.concentrateur')->find($id);
            }

            // RETOUR
            return $retour;

        } catch (Exception $e) {
            $retour['save'] = false;
            $retour['errorBdd'] = true;

            // KO
            return $retour;
        }

    }

    /**
     *
     */
    public function updatePlacesGeo()
    {
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'doublon' => false
        ];

        $data = json_decode(Input::get('data'), true);
        Log::debug('Voila les données à modifier : ' . print_r($data, true));

        try {
            DB::beginTransaction();
            foreach ($data as $p) {
                $place = Place::find($p['id']);
                $place->update($p);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Erreur SQL : ');
            Log::error($e);
            $retour['save'] = false;
            $retour['errorBdd'] = true;
        }
        return $retour;
    }


}
