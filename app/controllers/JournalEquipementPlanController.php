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
     * Last journal_equipement_plan pour la plan passé en param
     * @param $planId
     * @return mixed
     */

    public function last($planId)
    {
        // ATTENTION/ ARTHUNG/ les select sur une grosse quantité de données doivent être faits en queryBuilder et SURTOUT PAS en eloquent.
        $retour = DB::table('journal_equipement_plan')->where('plan_id','=',$planId)->max('id');

        return $retour ? $retour : 0;

    }


}
