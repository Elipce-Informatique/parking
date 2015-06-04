<?php

class Preference extends BaseModel
{
    protected $guarded = ['id'];
    protected $table = 'preference';


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * L'utilisateur associé à cette préférence
     * @return mixed
     */
    public function utilisateur()
    {
        return $this->belongsTo('Utilisateur');
    }
}