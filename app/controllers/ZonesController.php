<?php

class ZonesController extends \BaseController
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
        DB::beginTransaction();

        $data = json_decode(Input::get('data'), true);

        // DONNÉES DE LA ZONE
        $nom = Input::get('nom_zone');
        $description = Input::get('description_zone');
        $geojsonZone = json_encode($data['zone_geojson']);
        $plan_id = $data['plan_id'];

        // DONNÉES DES LIAISONS
        $allees = $data['allees'];
        $placesDefault = $data['places_default'];

        // CAS 1 : PAS D'ALLEES
        if (count($allees) == 0) {
            // CRÉATION DE LA ZONE EN BDD
            $newZone = Zone::create([
                'libelle' => $nom,
                'description' => $description,
                'defaut' => 0,
                'geojson' => $geojsonZone,
                'plan_id' => $plan_id
            ]);

            // CRÉATION ALLÉE PAR DÉFAUT
            $alleeDefault = Allee::create([
                'libelle' => $newZone->libelle . '.allee_defaut',
                'description' => 'allee_defaut',
                'defaut' => 1,
                'zone_id' => $newZone->id,
                'geojson' => ''
            ]);
            Log::debug('Allée créée ::::::: ' . print_r($alleeDefault->id, true));

            // ASSOCIATION DES PLACES À L'ALLÉE PAR DÉFAUT

            // TODO boucle pour parcourir toutes les places
        }


        DB::rollBack();
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


}
