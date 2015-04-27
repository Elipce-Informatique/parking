<?php

class ConfigurationParkingController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.configuration_parking');
    }

    /**
     * Génère les données à donner à manger au treeview
     * Les données brutes sont traitées en AJAX
     */
    public function menuTreeView()
    {
        return Parking::getTreeviewParking();
    }

    /**
     * @param $id
     */
    public function parkingInfos($id)
    {
        return Parking::find($id);
    }


}
