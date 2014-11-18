<?php

class AccueilController extends \BaseController {

	/**
	 * Affiche la page d'accueil de l'application
	 *
	 * @return Response
	 */
	public function index()
	{
		return View::make('pages.accueil');
	}


}
