<?php

class TestController extends \BaseController {

	/**
	 * @return Response
	 */
	public function index()
	{
		return Utilisateur::with('profils')->whereNom('yann')->first();
	}
}
