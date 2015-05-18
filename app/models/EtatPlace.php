<?php

class EtatPlace extends BaseModel
{
    protected $table = 'etat_place';
    protected $fillable = [];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    /**
     * Les états d'occupation associés à cet état de place
     * @return mixed
     */
    public function etats_occupations()
    {
        return $this->hasMany('EtatsDoccupation');
    }


}