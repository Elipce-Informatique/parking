<?php

class ServerCom extends \Eloquent
{

    protected $table = 'server_com';
    protected $fillable = [
        'parking_id',
        'protocol_version',
        'protocol_port',
        'software_name',
        'software_version',
        'software_build_date',
        'software_os'
    ];

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