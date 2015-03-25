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
        // Valeurs postées
        $post = Input::except('_token');

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

    public function getProfilsUsers($id)
    {
        return Utilisateur::getProfilsUsers($id);
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
    public function all()
    {
        return Utilisateur::getUtilisateurs();
    }

    /**
     * Calcule si le mail de l'utilisateur existe
     * @param $email: email à tester
     * @param int $idUser: utilisateur à ne opas prendre en compte dans la recherche
     * @return
     */
    public function isMailExists($email, $idUser=0)
    {
        return json_encode(Utilisateur::isMailExists($email, $idUser));
    }

    /**
     * Affiche la fiche de l'utilisateur actuellement connecté.
     */
    public function compte()
    {
        $oUser = Auth::user();
        return View::make('pages.utilisateur_courant')->with('user', $oUser);
    }

    /**
     * Affiche la fiche de l'utilisateur actuellement connecté.
     */
    public function updateCompte()
    {
        $oUser = Auth::user();

        // Champs du formualaire
        $fields = Input::except('_token');

        $bool = true;

        // Mot de passe avant modification et nouveau mdp renseignés
        if(isset($fields['passOld']) && isset($fields['passNew'])) {
            // Ancien mot de passe valide ?
            $bool = Utilisateur::isPasswordOk($fields['passOld']);
        }

        // Ancien PWD OK
        if($bool) {
            return json_encode(Utilisateur::updateUser($oUser->id, $fields));
        }
        // Ancien PWD KO
        else {
            return json_encode(array('save' => false, 'pass' => 'incorrect'));
        }
    }

    /**
     * Vérifie le mot de pass de l'utilisateur actuel
     * @param $pass : mot de pass à tester
     */
    public function verifMDPcompte($pass){
        return json_encode(Utilisateur::isPasswordOk($pass));
    }

}
