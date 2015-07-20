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
     * @param $planId
     * @param $journalId
     */
    public static function getJournalAlerteFromVersion($planId, $journalId)
    {
        return JournalAlerte::with(['alerte' => function ($q) use ($planId) {
            $q->where('plan_id', '=', $planId)
                ->with('type');
        }])->where('id', '>', $journalId)->get();
    }


}