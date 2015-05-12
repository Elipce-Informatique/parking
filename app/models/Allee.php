<?php

class Allee extends \Eloquent
{
    protected $table = 'allee';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les places de l'allée
     * @return mixed
     */
    public function places()
    {
        return $this->hasMany('Place');
    }

    /**
     * La zone de l'allée :
     * Inverse de la relation de la zone
     * @return mixed
     */
    public function zone()
    {
        return $this->belongsTo('Zone');
    }
}