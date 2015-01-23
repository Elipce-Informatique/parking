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

    /*
     * Récupère tout les états d'occupation
     * ['id', 'libelle', 'couleur', 'type_place.libelle', 'etat_place.libelle']
     */
    public static function getAll(){
        $res = DB::table('etat_occupation')
                ->leftJoin('type_place', function ($join) {$join->on('etat_occupation.type_place_id', '=', 'type_place.id');})
                ->leftJoin('etat_place', function ($join) {$join->on('etat_occupation.etat_place_id', '=', 'etat_place.id');})
                ->groupBy('etat_occupation.id')
                ->get(['etat_occupation.id', 'etat_occupation.libelle', 'etat_occupation.couleur', 'type_place.libelle as type_place', 'etat_place.libelle as etat_place', 'type_place.logo']);
        return $res;
    }

    /*
     * Récupère un état d'occupation
     * ['id', 'libelle', 'couleur', 'type_place.id', 'etat_place.id']
     */
    public static function getInfosEtatById($id){
        $res = DB::table('etat_occupation')
            ->leftJoin('type_place', function ($join) {$join->on('etat_occupation.type_place_id', '=', 'type_place.id');})
            ->leftJoin('etat_place', function ($join) {$join->on('etat_occupation.etat_place_id', '=', 'etat_place.id');})
            ->groupBy('etat_occupation.id')
            ->where('etat_occupation.id', $id)
            ->get(['etat_occupation.libelle', 'etat_occupation.couleur', 'type_place.id as type_place_id', 'etat_place.id as etat_place_id', 'type_place.logo']);
        return $res;
    }

    /*
     * Retourne les types de place
     * ['id', 'libelle', 'logo']
     */
    public static function getTypesPlace(){
        $res = DB::table('type_place')
            ->get(['type_place.id', 'type_place.libelle', 'type_place.logo']);
        return $res;
    }

    /*
     * Retourne les états de place
     * ['id', 'libelle', 'etat_capteur.id']
     */
    public static function getEtatsPlace(){
        $res = DB::table('etat_place')
            ->get(['etat_place.id', 'etat_place.libelle', 'etat_place.etat_capteur_id']);
        return $res;
    }

    /*
     * Retourne les états capteur
     * ['id', 'libelle']
     */
    public static function getEtatsCapteur(){
        $res = DB::table('etat_capteur')
            ->get(['etat_capteur.id', 'etat_capteur.libelle']);
        return $res;
    }

    /*
     * Retourne si ce libelle existe déjà ou pas
     */
    public static function getLibelleExist($libelle){
        $etat = DB::table('etat_occupation')->where('libelle', $libelle)->first(['id']);
        return array('good' => empty($etat));
    }
}
