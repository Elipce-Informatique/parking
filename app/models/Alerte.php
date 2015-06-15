<?php

class Alerte extends BaseModel
{
    protected $table = 'alerte';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Les places de l'alerte
     * @return mixed
     */
    public function places()
    {
        return $this->belongsToMany('Place');
    }

    /**
     * Le journal des alertes
     * @return mixed
     */
    public function journaux()
    {
        return $this->belongsTo('JournalAlerte');
    }

    /**
     * le type d'alerte
     * @return mixed
     */
    public function type()
    {
        return $this->belongsTo('TypeAlerte');
    }

    /**
     * Le parking associé à l'alerte
     * @return mixed
     */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }


    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/


}