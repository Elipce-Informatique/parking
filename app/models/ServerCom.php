<?php

class ServerCom extends \Eloquent
{

    protected $table = 'server_com';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le parking associé au server
     * @return mixed
     */
    public function parking()
    {
        return $this->belongsTo('Parking');
    }

}