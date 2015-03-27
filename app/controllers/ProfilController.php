<?php

class ProfilController extends \BaseController
{

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
        // Valeurs postées
        $post = Input::except(['_token', '_method']);

        return json_encode(Profil::creerProfil($post));
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Profil::find($id);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        $fields = Input::except('_token');
        return Profil::updateProfil($id, $fields);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        return json_encode(Profil::deleteProfil($id));
    }

    /**
     * Récupère tous les profils
     * ['id', 'traduction']
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function all()
    {
        return Profil::all(array('id', 'traduction'));
    }

    /**
     * Récupère tout les modules avec les droits associés selon le profil
     * ['id', 'traduction', 'etat']
     * @param $idProfil
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getProfilModule($profils)
    {
        return Profil::getProfilModule($profils);
    }

    /**
     * Calule si le libellé passé en paramètre existe
     * @param $libelle : libellé à tester
     * @param $id : ID profil à exclure
     * @return string: booléen true ou false
     */
    public function getProfilExistLibelle($libelle, $id = 0)
    {
        return json_encode(Profil::isLibelleExists($libelle, $id));
    }

    /**
     * Le profil est-il associé à un utilisateur
     * @param $idProfil : profil.id
     * @return string
     */
    public function isProfilUsed($idProfil)
    {
        return json_encode(Profil::isProfilUsed($idProfil));
    }
}
