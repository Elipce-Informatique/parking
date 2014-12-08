<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getMenuLeftItems(1);
        return $modules;
    }
}
