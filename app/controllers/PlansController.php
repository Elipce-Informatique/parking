<?php

class PlansController extends \BaseController
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
        return Plan::find($id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function showWithPlaces($id)
    {
        return Plan::with(['afficheurs' => function ($q) {
            $q->where('afficheur.a_supprimer', '=', '0')->with('vues.type_place');
        }])
            ->with('zones.allees.places.etat_occupation')
            ->with('zones.allees.places.capteur.bus.concentrateur')
            ->find($id);
    }

    /**
     * @param $id
     * @return array
     */
    public function updateCalibre($id)
    {
        $plan = Plan::find($id);
        $plan->calibre = Input::get('calibre');
        $retour = $plan->save();
        return ['retour' => $retour];
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
