<?php

class ConfigEquipement extends \Eloquent
{
    protected $table = 'config_equipement';
    protected $fillable = ['libelle', 'json', 'v4_id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Les capteurs de cette configuration
     * @return mixed
     */
    public function capteurs()
    {
        return $this->belongsToMany('Capteur', 'capteur_config');
    }

    /**
     * Les afficheurs de cette configuration
     * @return mixed
     */
    public function afficheurs()
    {
        return $this->belongsToMany('Afficheur', 'afficheur_config');
    }
}