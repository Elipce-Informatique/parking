<?php

class SupervisionParkingController extends \BaseController
{

    /**
     * Accueil de la supervision
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.supervision');
    }

    /**
     * Visualisation temps réel du parking
     *
     * @return Response
     */
    public function visualisation()
    {
        return View::make('pages.visualisation');
    }

    /**
     * Visualisation temps réel du parking
     *
     * @return Response
     */
    public function commandes()
    {
//        return View::make('pages.visualisation');
    }



}
