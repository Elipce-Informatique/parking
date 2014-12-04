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
//        dd(intval(ini_get('smtp_port')));
        if (Auth::check()) {
            return Redirect::to('/accueil');
        }
        return View::make('pages.login');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        if (Auth::attempt(Input::only('email', 'password'))) {
            return Redirect::to('/');
        }
        Flash::error(Lang::get('global.login_error'));
        return Redirect::back()->withInput();
    }


    /**
     * Log the user out
     *
     * @return Response
     */
    public function destroy()
    {
        Auth::logout();
        return Redirect::to('login');
    }


}
