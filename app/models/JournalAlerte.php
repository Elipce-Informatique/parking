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
    public function alerte()
    {
        return $this->belongsTo('Alerte');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/

    /**
     *
     * @param $parkingId
     * @param $journalId
     */
    public static function getJournalAlerteFromVersion($parkingId, $journalId)
    {
        return JournalAlerte::with(['alerte' => function ($q) use ($parkingId) {
            $q->where('parking_id', '=', $parkingId)
                ->with('type');
        }])->where('id', '>', $journalId)->get();
    }


}