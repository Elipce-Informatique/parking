<?php
/**
 * Created by PhpStorm.
 * User: yann
 * Date: 24/11/2014
 * Time: 10:16
 */

class Calendrier extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamps = false;
    protected $table = 'calendrier';
    protected $fillable = ['jour'];


    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }
    public function calendrierJour()
    {
        return $this->belongsTo('CalendrierJours','jour_calendrier_id');
    }
    public function typeEclairage()
    {
        return $this->belongsTo('TypeEclairage');
    }


    /*
    |--------------------------------------------------------------------------
    | FONCTIONS
    |--------------------------------------------------------------------------
    */
    public static function GetInfosFromParking($idPark){
        return Calendrier::with('calendrierJour')
            ->with('parking')
            ->where('calendrier.parking_id','=',$idPark)
            ->get()
            ;
    }

}