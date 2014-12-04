<?php

class MenuController extends \BaseController {

    /**
     * Retourne le tableau des items de menu pour le menu top
     * @return mixed
     */
    public function menuTopItemsFromSession(){
        return Auth::user()->getMenuTopItems();
    }

    /**
     * Retourne le tableau des items de menu pour le menu top
     * @return mixed
     */
    public function menuTopInfosUserFromSession(){
        return [
            'nomUtilisateur'=> Auth::user()->nom,
            'logoutRoute'=> URL::asset('/')."logout",
            'logoutText'=> Lang::get('global.logout'),
            'dropdown'=> []
        ];
    }


}
