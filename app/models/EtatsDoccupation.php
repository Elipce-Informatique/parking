<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class EtatsDoccupation extends Eloquent implements UserInterface, RemindableInterface
{

    use UserTrait, RemindableTrait;

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public static function getAll(){
        $res = DB::table('etat_occupation')
                ->leftJoin('type_place', function ($join) {$join->on('etat_occupation.type_place_id', '=', 'type_place.id');})
                ->leftJoin('etat_place', function ($join) {$join->on('etat_occupation.etat_place_id', '=', 'etat_place.id');})
                ->groupBy('etat_occupation.id')
                ->get(['etat_occupation.id', 'etat_occupation.libelle', 'etat_occupation.couleur', 'type_place.libelle as type_place', 'etat_place.libelle as etat_place', 'type_place.logo']);
        return $res;
    }
}
