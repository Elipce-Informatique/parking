<?php

class TestController extends \BaseController {

	/**
	 * @return Response
	 */
	public function index()
	{
		return Utilisateur::has('profils')->get();
	}
}
