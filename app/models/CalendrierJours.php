<?php
/**
 * Created by PhpStorm.
 * User: vivian
 * Date: 19/02/2015
 * Time: 15:14
 */

class CalendrierJours extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamp = false;

    protected $fillable = ['libelle'];
    protected $table='jour_calendrier';

    /**
     * Calcule tous les jours prédéfinis existants
     */
    public static function getJoursPredefinis(){
        $res = CalendrierJours::all(array('id', 'libelle', 'ouverture', 'fermeture','couleur'));
        return $res;
    }

    /**
     * Calcule les infos du jour prédéfini passé en param
     * @param $id: ID table jour_calendrier
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public static function getInfosJoursPredefinis($id){

        $res = CalendrierJours::find($id);
        return $res;
    }
}