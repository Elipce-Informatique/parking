<?php

class EtatCapteur extends BaseModel
{
    protected $fillable = [];
    protected $table = 'etat_capteur';

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les capteurs liés à cet état
     * @return mixed
     */
    public function capteurs()
    {
        return $this->hasMany('Capteur');
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