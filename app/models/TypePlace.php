<?php

class TypePlace extends \Eloquent
{
    protected $table = 'type_place';
    public $timestamps = false;
    protected $fillable = [];

    /**
     * Les places associés à ce type_place
     * @return mixed
     */
    public function places()
    {
        return $this->hasMany('Place');
    }
}