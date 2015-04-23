<?php

class Plan extends \Eloquent
{
    protected $table = 'plan';
    public $timestamps = false;
    protected $fillable = [
        'libelle',
        'description',
        'url',
        'niveau_id',
    ];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * Le niveau du plan
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
    }

    /**
     * Les zones du plan
     * @return mixed
     */
    public function zones()
    {
        return $this->hasMany('Zone');
    }
}