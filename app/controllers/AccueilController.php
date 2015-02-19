<?php

class AccueilController extends \BaseController {

	/**
	 * Affiche la page d'accueil de l'application
	 *
	 * @return Response
	 */
	public function index()
	{
        $aModule = ['administration'=>'', 'administration_parking'=>'', 'supervision'=>'', 'calendrier'=>''];
        // Parcours des modules
        foreach($aModule as $key=>&$ligne) {
            if (!Auth::user()->isModuleAccessibleByUrl($key)) {
                $ligne = 'hide';
            }
        }
		return View::make('pages.accueil')->with('url',$aModule);
	}


}
