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

        try {
            $data = json_decode(Input::get('data'), true);

            // DONNÉES DE LA ZONE
            $nom = Input::get('nom_zone');
            $description = Input::get('description_zone');
            $geojsonZone = json_encode($data['zone_geojson']);
            $plan_id = $data['plan_id'];

            // DONNÉES DES LIAISONS
            $allees = $data['allees'];
            $placesDefault = $data['places_default'];

            // ------------------------------------------------------------------
            // DANS TOUS LES CAS :


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
            // ------------------------------------------------------------------
            // ------------------------------------------------------------------
            // CAS 1 : PAS D'ALLEES
            if (count($allees) == 0) {
                // ASSOCIATION DES PLACES DEFAUT À L'ALLÉE PAR DÉFAUT
                foreach ($placesDefault as $place) {
                    Place::find($place['id'])->update(['allee_id' => $alleeDefault->id]);
                }
            }
            // ------------------------------------------------------------------
            // CAS 2 : DES ALLÉES
            else {

                // ASSOCIATION DES ALLÉES SEULEMENT
                foreach ($allees AS $allee) {
                    Allee::find($allee['id'])->update(['zone_id' => $newZone->id]);
                }

                // CAS 2.2 ASSOCIATION PLACES
                if (count($placesDefault) > 0) {
                    // ASSOCIATION DES PLACES DEFAUT À L'ALLÉE PAR DÉFAUT
                    foreach ($placesDefault as $place) {
                        Place::find($place['id'])->update(['allee_id' => $alleeDefault->id]);
                    }
                }
            }
            // ------------------------------------------------------------------

            // Fin du try, tout s'est bien passé
            DB::commit();
            return json_encode(true);
        } catch (Exception $e) {
            Log::error('ERREUR D INSERTION ZONE :');
            Log::error($e);
            DB::rollBack();
            return json_encode(false);
        }
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
