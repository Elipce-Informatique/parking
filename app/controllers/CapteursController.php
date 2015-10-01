<?php

class CapteursController extends \BaseController
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
     * Crée plusieurs capteurs virtuels
     */
    public function create_virtuels()
    {
        $capteurs = json_decode(Input::get('capteurs'));
        $configs_ids = json_decode(Input::get('configs_ids'));

        // INSERTION DES CAPTEURS EN BDD
        DB::beginTransaction();
        try {
            foreach ($capteurs AS $capteur) {
                $capteurBDD = Capteur::create([
                    'bus_id' => $capteur->bus_id,
                    'num_noeud' => $capteur->num_noeud,
                    'adresse' => $capteur->adresse,
                    'leg' => $capteur->leg,
                    'software_version' => $capteur->software_version
                ]);

                $capteurBDD->configs()->attach($configs_ids);

                $place = Place::find($capteur->place_id);
                $place->capteur()->associate($capteurBDD);
                $place->save();
            }
            DB::commit();
            return json_encode(true);
        } catch (Exception $e) {
            Log::error('ERREUR D INSERTION CAPTEUR VIRTUEL :');
            Log::error($e);
            DB::rollBack();
            return json_encode(false);
        }
    }
}
