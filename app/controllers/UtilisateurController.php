<?php

class UtilisateurController extends \BaseController
{

    /**
     * Display a listing of the users.
     *
     * @return Response
     */
    public function index()
    {
        $oUsers = Utilisateur::all();
        return View::make('pages.utilisateur')->with('users', $oUsers);
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
        // Mot de passe généré sur 6 digits
        $pwd = Hash::make(time());
        $pwd = substr($pwd, 8, 6);
        $pwdBdd = Hash::make($pwd);

        // TODO envoyer $pwd par mail.

        // Valeurs postées
        $post = Input::except('_token');
        $post['password'] = $pwdBdd;

        return json_encode(Utilisateur::creerUtilisateur($post));
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Utilisateur::getUtilisateurFromId($id);
    }

    public function getUserAndProfil($id){
        return Utilisateur::getUserAndProfil($id);
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
        // Champs du formualaire
        $fields = Input::except('_token');

        return json_encode(Utilisateur::updateUser($id, $fields));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
       return json_encode(Utilisateur::deleteUser($id));
    }

    /**
     * Récupère tous les utilisateurs
     */
    public function all(){
        return Utilisateur::getUtilisateurs();
    }

    public function getUserExist($email){
        return Utilisateur::getUserExist($email);
    }

}
