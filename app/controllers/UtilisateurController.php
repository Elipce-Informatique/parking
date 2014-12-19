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
        // Mot de passe généré
        $pwd = Hash::make(time());
        $pwd = substr($pwd, 8, 8);
        Log::info('MON PASSWORD '.$pwd);

        // Valeurs postées
        $post = Input::except('_token');
        $post['password'] = $pwd;

        // Nouvel utilisateur
        $user = Utilisateur::create($post);
        return $user;
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
        $bSave = false;
        // Trouver le user
        $user = Utilisateur::find($id);
        // Champs du formualaire
        $fields = Input::except('_token');
        // Parcourir les champs envoyés par PUT
        foreach($fields as $key=>$val) {
            $user->$key = $val;
        }

        // Sauvegarde
        try {
            $bSave = $user->save();
        }
        catch(Exception $e){
            $retour = array('data'=>$fields,'save'=>false);
        }
        // Enregistrement OK
        if($bSave){
            $retour = array('data'=>$this->show($id),'save'=>false);
        }
        return json_encode($retour);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Récupère tous les utilisateurs
     */
    public function all(){
        return Utilisateur::getUtilisateurs();
    }

}
