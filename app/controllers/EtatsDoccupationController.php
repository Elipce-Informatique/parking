<?php

class EtatsDoccupationController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return View::make('pages.etats_d_occupation');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		// Valeurs postées
		$fields = Input::except('_token');

		return json_encode(EtatsDoccupation::creerEtatOccupation($fields));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		// Champs du formualaire
		$fields = Input::except('_token');
		Log::warning('-----------> UPDATE '.$id.': '.print_r($fields, true).' <-----------');
		return json_encode(EtatsDoccupation::updateEtatDoccupation($id, $fields));
	}
	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return json_encode(EtatsDoccupation::getInfosEtatById($id));
	}

	public function all(){
        return json_encode(EtatsDoccupation::getAll());
	}

	public function getTypesPlace(){
		return json_encode(EtatsDoccupation::getTypesPlace());
	}

	public function getEtatsPlace(){
		return json_encode(EtatsDoccupation::getEtatsPlace());
	}

	public function getEtatsCapteur(){
		return json_encode(EtatsDoccupation::getEtatsCapteur());
	}

	public function getLibelleExist($libelle){
		return json_encode(EtatsDoccupation::getLibelleExist($libelle));
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		return json_encode(EtatsDoccupation::deleteEtatDoccupation($id));
	}


}
