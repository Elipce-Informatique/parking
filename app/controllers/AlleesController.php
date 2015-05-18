<?php

class AlleesController extends \BaseController
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
            Log::debug('Données AJAX des allées : ' . print_r($data, true));

            // DONNÉES DE L'ALLÉE
            $nom = Input::get('nom_allee');
            $description = Input::get('description_allee');

            $allee_geojson = json_encode($data['allee_geojson']);
            $zone_id = $data['zone_id'];
            $places = $data['places'];

            // ------------------------------------------------------------------
            // DANS TOUS LES CAS :

            // CRÉATION DE L'ALLÉE EN BDD
            $newAllee = Allee::create([
                'libelle' => $nom,
                'description' => $description,
                'defaut' => 0,
                'zone_id' => $zone_id,
                'geojson' => $allee_geojson
            ]);
            // PARCOURT DES PLACES POUR LES AJOUTER À L'ALLÉE
            if (count($places) > 0) {
                foreach ($places AS $p) {
                    Place::find($p['id'])->update(['allee_id' => $newAllee->id]);
                }
            }
            // Fin du try, tout s'est bien passé
            DB::commit();
//            DB::rollBack();
            return json_encode(true);
        } catch (Exception $e) {
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
