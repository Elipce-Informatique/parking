<?php

class Zone extends \Eloquent
{
    protected $table = 'zone';
    public $timestamps = false;
    protected $fillable = [];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les allées de la zone
     * @return mixed
     */
    public function allees()
    {
        return $this->hasMany('Allee');
    }

    /**
     * Le niveau de la zone :
     * Inverse de la relation du niveau
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
    }

    /**
     * La zone du niveau :
     * Inverse de la relation de la zone
     * @return mixed
     */
    public function zone()
    {
        return $this->belongsTo('Zone');
    }
}