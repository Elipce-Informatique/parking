<?php

class JournalAlerte extends BaseModel
{
    protected $table = 'journal_alerte';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/
    /**
     * L'alerte de cette entrée de journal
     * @return mixed
     */
    public function alertes()
    {
        return $this->belongsTo('Alerte');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/


}