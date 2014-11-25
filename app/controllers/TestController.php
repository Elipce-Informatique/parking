<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getMenuTopItems();
        return $modules;
    }
}
