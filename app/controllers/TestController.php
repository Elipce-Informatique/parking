<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getAllModules();
        return $modules;
    }
}
