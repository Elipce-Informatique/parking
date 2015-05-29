<?php

class ParkingsController extends \BaseController
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
        return Parking::find($id);
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
     * Récupère la liste des concentrateurs du parking avec toutes les données sous-jacentes (bus et capteurs)
     * @param $id : id du parking
     * @return reponse
     */
    public function getConcentrateurs($id)
    {
        return Concentrateur::with(['buses' => function ($q) {
            $q->with(['capteurs' => function ($q) {
                $q->with('place')->orderBy('adresse');
            }]);
        }])->where('parking_id', '=', $id)
            ->get();
    }


}
