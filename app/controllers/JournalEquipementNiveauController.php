<?php

class JournalEquipementNiveauController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return JournalEquipementNiveau::get();
    }


    /**
     * Display the specified resource.
     *
     * @param  int $niveauId
     * @return Response
     */
    public function show($niveauId)
    {
        return JournalEquipementNiveau::getJournalNiveau($niveauId);
    }

    /**
     * @param $niveauId : Id du niveau
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showFromVersion($niveauId, $journalId)
    {
        return JournalEquipementNiveau::getJournalNiveauFromVersion($niveauId, $journalId);
    }

    /**
     * @param $niveauId : Id du niveau
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showPlacesFromVersion($niveauId, $journalId)
    {
        return JournalEquipementNiveau::getJournalPlacesFromVersion($niveauId, $journalId);
    }

    /**
     * @param $niveauId
     * @return mixed
     */
    public function last($niveauId)
    {
        return JournalEquipementNiveau::whereNiveauId($niveauId)->get()->max('id');
    }


}
