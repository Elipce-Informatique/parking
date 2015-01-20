<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        return View::make('pages.test');
    }

    /**
     * @return Response
     */
    public function indexCarte()
    {
        return View::make('pages.test_carte');
    }
}
