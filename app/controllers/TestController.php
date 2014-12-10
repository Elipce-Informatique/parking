<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getMenuLeftItemsFromUrl('accueil');

        $testPierre = Module::with('profils')->whereHas('profils.id', 1)->get();
        return $testPierre;
//        return json_encode(Module::getTopLevelParentModuleFromUrl('test'));
    }
}
