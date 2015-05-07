<?php

class CalendrierProgrammationController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.calendrier_programmation');
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
        $data = Input::all();
        $data['data'] = json_decode($data['data'], true);
        $retour = true;

        try {
            DB::beginTransaction();

            Log::debug('data '.print_r($data, true));

            // Insert
            if (count($data['data']['insert']) > 0) {

                // Parcours des insertions
                foreach ($data['data']['insert'] as $insert) {
                    $insert['parking_id'] = $data['parking'];
//                    Log::debug('INSERT '.print_r($insert, true));
                    if(!Calendrier::createCalendrier($insert)){
                        $retour = false;
                        DB::rollBack();
                        break;
                    };
                }
            }

            // Update
            if (count($data['data']['update']) > 0) {

                // Parcours des insertions
                foreach ($data['data']['update'] as $update) {
                    if(!Calendrier::updateCalendrier($update, $data['parking'])){
                        $retour = false;
                        DB::rollBack();
                        break;
                    };
                }
            }

            // Delete
            if (count($data['data']['delete']) > 0) {

                // Parcours des insertions
                foreach ($data['data']['delete'] as $del) {
                    if(!Calendrier::deleteCalendrier($del, $data['parking'])){
                        $retour = false;
                        DB::rollBack();
                        break;
                    };
                }
            }

            DB::commit();
        }catch (Exception $e) {
            // Erreur SQL
            DB::rollBack();
            $retour = false;
        }
        return json_encode($retour);
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        // Calcul des données calendaires du parking
        return json_encode(Parking::getCalendrier($id));
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
     * Initialisation des jours prédéfinis et la liste des parkings
     * @param $id
     * @return array
     */
    public function init()
    {
        $retour = [
            'jours' => CalendrierJours::all(),
            'parkings' => Parking::getTreeviewParking()
            ];
        return $retour;
    }



}
