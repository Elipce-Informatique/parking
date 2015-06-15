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
     * Les entrées de journal de l'alerte
     * @return mixed
     */
    public function journal()
    {
        return $this->hasMany('JournalAlerte');
    }

    /**
     * le type d'alerte
     * @return mixed
     */
    public function type()
    {
        return $this->belongsTo('TypeAlerte', 'type_alerte_id', 'id');
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