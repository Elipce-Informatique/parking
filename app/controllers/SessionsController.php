<?php

class SessionsController extends \BaseController
{
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        if (Auth::check()) {
            return Redirect::to('/accueil');
        }
        return View::make('sessions.create');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        if (Auth::attempt(Input::only('email', 'password'))) {
            return "Bienvenue ".Auth::user()->nom;
        }
        return 'Failed !';
    }


    /**
     * Log the user out
     *
     * @return Response
     */
    public function destroy()
    {
        Auth::logout();
        return Redirect::route('sessions.create');
    }


}
