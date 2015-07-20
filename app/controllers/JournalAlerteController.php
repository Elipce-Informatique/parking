<?php

class JournalAlerteController extends \BaseController
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

    /**
     * Retourne le dernier id de journal alerte pour le parking spécifié
     * @param $planId : id du parking pour le filtre
     *
     * @return l'id max ou 0 si aucune entrée pour ce parking
     */
    public function last($planId)
    {
        $retour = JournalAlerte::with(['alerte' => function ($q) use ($planId) {
            $q->where('plan_id', '=', $planId);
        }])->get()->max('id');
        return $retour ? $retour : 0;
    }

    /**
     * @param $planId
     * @param $journalId
     * @return mixed
     */
    public function showFromVersion($planId, $journalId)
    {
        return JournalAlerte::getJournalAlerteFromVersion($planId, $journalId);
    }

}
