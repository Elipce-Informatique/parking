<?php

class TypePlace extends BaseModel
{
    protected $table = 'type_place';
    protected $fillable = [];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    /**
     * Les places associés à ce type_place
     * @return mixed
     */
    public function places()
    {
        return $this->hasMany('Place');
    }

    /**
     * Les places associés à ce type_place
     * @return mixed
     */
    public function etats_occupations()
    {
        return $this->hasMany('EtatsDoccupation');
    }




}