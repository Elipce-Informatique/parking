<?php

class ProfilController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        return View::make('pages.profil');
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        return Profil::find($id);
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

    /**
     * Récupère tous les profils
     * ['id', 'traduction']
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function all(){
        return Profil::all();
    }

    /**
     * Récupère tout les modules avec les droits associés selon le profil
     * ['id', 'traduction', 'etat']
     * @param $idProfil
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getProfilModule($profils){
        return Profil::getProfilModule($profils);
    }
}
