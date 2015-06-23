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

            // DONNÉES DE L'ALLÉE
            $nom = Input::get('nom_allee');
            $description = Input::get('description_allee');

            $allee_geojson = $data['allee_geojson'];
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
            return json_encode([
                    'retour' => Allee::find($newAllee->id)]
            );
        } catch (Exception $e) {
            Log::error('ERREUR D INSERTION ALLEE :');
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
        Log::debug('destroy, avec ces données : ' . print_r($id, true));
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
        $action = Allee::deleteAllees($ids);
        $retour = [
            'save' => $action,
            'errorBdd' => !$action,
            'model' => null,
            'doublon' => false
        ];
        return $retour;
    }


}
