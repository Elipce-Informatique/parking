<?php

class EtatCapteur extends \Eloquent
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'etat_capteur';

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * La place du capteur
     * @return mixed
     */
    public function places()
    {
        return $this->belongsTo('Capteur');
    }



    /*
     * Retourne les états capteur
     * ['id', 'libelle']
     */
    public static function getEtatsCapteur()
    {
        return EtatCapteur::all();
    }
}