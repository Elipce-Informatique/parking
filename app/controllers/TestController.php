<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        $modules = Auth::user()->getAllModulesForAuthuser();

//        $testPierre = Module::with('profils')->whereHas('profils.id', 1)->get();
        return $modules;
//        return json_encode(Module::getTopLevelParentModuleFromUrl('test'));
    }
}
