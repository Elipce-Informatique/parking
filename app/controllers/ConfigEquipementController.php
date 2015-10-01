<?php

class ConfigEquipementController extends \BaseController
{

    /**
     * Display a listing of the resource.
     * GET /configequipement
     *
     * @return Response
     */
    public function index()
    {
        return 'totot';
    }

    /**
     * Show the form for creating a new resource.
     * GET /configequipement/create
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * POST /configequipement
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     * GET /configequipement/{id}
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
     * GET /configequipement/{id}/edit
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
     * PUT /configequipement/{id}
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
     * DELETE /configequipement/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Display all resources.
     * GET /config_equipment/all
     *
     * @return Response
     */
    public function all()
    {
        return ConfigEquipement::all();
    }

    /**
     * Display all resources.
     * GET /config_equipment/combo_all
     *
     * @return Response
     */
    public function comboAll()
    {
        return ConfigEquipement::get([DB::raw('libelle AS label'), DB::raw('CAST(id AS CHAR) AS value')]);
    }

}