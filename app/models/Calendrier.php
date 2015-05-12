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
    protected $table = 'calendrier';
    protected $fillable = ['jour', 'jour_calendrier_id', 'parking_id'];


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

    /**
     * Créer une ligne de calendrier
     * @param $fields: champs à ajouter
     * @return bool
     */
    public static function createCalendrier($fields){
        $retour = true;
        // Essai d'enregistrement
        try {
            // Création du jour
            $new = Calendrier::create($fields);
        }
        catch(Exception $e){
            $retour = false;
            Log::error('erreur creation calendrier: '.$e->getMessage());
        }
        return $retour;
    }

    /**
     * MAJ d'une ligne de calendrier
     * @param $fields: nouvreaux champs
     * @param $park: ID parking
     * @return bool
     */
    public static function updateCalendrier($fields, $park){
        $retour = true;
        // Essai d'enregistrement
        try {
            // Modification du calendrier
            Calendrier::where('jour','=',$fields['jour'])
                ->where('parking_id', '=', $park)
                ->update($fields);
        }
        catch(Exception $e){
           $retour = false;
            Log::error('erreur update calendrier: '.$e->getMessage());
        }
        return $retour;
    }

    /**
     * Supprimer une lmigne de calendrier
     * @param $fields: champs à supprimer
     * @param $park: ID parking
     * @return bool
     */
    public static function deleteCalendrier($fields, $park){
        // Variables
        $bSave = true;

        // Chercher la ligne de calendrier
        $cal = Calendrier::where('jour','=',$fields['jour'])
            ->where('parking_id', '=', $park)
            ->first();
//Log::debug(print_r(DB::getQueryLog(),true));
        // Supprimer l'état d'occupataion
        try {
            $cal->delete();
        }
        catch (Exception $e) {
            $bSave = false;
            Log::error('erreur delete calendrier: '.$e->getMessage());
        }
        return $bSave;
    }

}