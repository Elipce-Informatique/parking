<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getMenuLeftItemsFromUrl('accueil');
        return $modules;
//        return json_encode(Module::getTopLevelParentModuleFromUrl('test'));
    }
}
