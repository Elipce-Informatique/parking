<?php

class JournalEquipementPlanController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return JournalEquipementPlan::get();
    }


    /**
     * Display the specified resource.
     *
     * @param  int $planId
     * @return Response
     */
    public function show($planId)
    {
        return JournalEquipementPlan::getJournalPlan($planId);
    }

    /**
     * @param $planId : Id du plan
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showFromVersion($planId, $journalId)
    {
        return JournalEquipementPlan::getJournalPlanFromVersion($planId, $journalId);
    }

    /**
     * @param $planId : Id du plan
     * @param $journalId : Id journal depuis lequel se baser
     * @return Response
     */
    public function showPlacesFromVersion($planId, $journalId)
    {
        return JournalEquipementPlan::getJournalPlacesFromVersion($planId, $journalId);
    }

    /**
     * @param $planId
     * @return mixed
     */
    public function last($planId)
    {
        $retour = JournalEquipementPlan::wherePlanId($planId)->get()->max('id');
        return $retour ? $retour : 0;
    }


}
