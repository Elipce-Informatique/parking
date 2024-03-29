<?php

class CalendrierJoursController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.calendrier_jours');
    }


    public function all()
    {
        return CalendrierJours::getJoursPredefinis();
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
        return json_encode(CalendrierJours::createCalendrierJour(Input::all()));
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return CalendrierJours::getInfosJoursPredefinis($id);
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
        return json_encode(CalendrierJours::updateCalendrierJour($id, Input::all()));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        return json_encode(CalendrierJours::deleteCalendrierJour($id));
    }

    /**
     * Vérifie si le libellé passé en paramètre existe déjà en BDD
     * @param $libelle : libellé à vérifier
     * @param $id : ID à ne pas prendre en compte (mode édition)
     *
     */
    public function verifLibelle($libelle, $id = '')
    {
        return json_encode(CalendrierJours::isLibelleExists($libelle, $id));

    }


}
