<?php

class TestController extends \BaseController {

	/**
	 * @return Response
	 */
	public function index()
	{
		return View::make('test');
	}
}
