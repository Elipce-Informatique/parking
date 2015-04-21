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
     * @param  int $parkingId
     * @return Response
     */
    public function show($parkingId)
    {
        return JournalEquipementNiveau::getJournalParking($parkingId);
    }

    /**
     * @param $parkingId : Id du parking
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showFromVersion($parkingId, $journalId)
    {
        return JournalEquipementNiveau::getJournalParkingFromVersion($parkingId, $journalId);
    }

    /**
     * @param $parkingId : Id du parking
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showPlacesFromVersion($parkingId, $journalId)
    {
        return JournalEquipementNiveau::getJournalPlacesFromVersion($parkingId, $journalId);
    }



}
