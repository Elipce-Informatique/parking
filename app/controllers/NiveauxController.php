<?php

class NiveauxController extends \BaseController
{

    /**
     * Display a listing of the resource.
     * GET /niveaux
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     * GET /niveaux/create
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * POST /niveaux
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     * GET /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Niveau::with('zones.allees.places.etat_occupation')->find($id);
    }

    /**
     * Show the form for editing the specified resource.
     * GET /niveaux/{id}/edit
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
     * PUT /niveaux/{id}
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
     * DELETE /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

}