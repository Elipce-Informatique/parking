<?php

class JournalEquipementPlan extends BaseModel
{
    protected $guarded = ['id'];
    protected $table = "journal_equipement_plan";


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le plan de cette entrée de journal
     * @return mixed
     */
    public function plan()
    {
        return $this->belongsTo('Plan');
    }

    /**
     * Le place de cette entrée de journal
     * @return mixed
     */
    public function place()
    {
        return $this->belongsTo('Place');
    }

    /**
     * Le afficheur de cette entrée de journal
     * @return mixed
     */
    public function afficheur()
    {
        return $this->belongsTo('Afficheur');
    }

    /**
     * Le afficheur de cette entrée de journal
     * @return mixed
     */
    public function etat_occupation()
    {
        return $this->belongsTo('EtatsDoccupation');
    }

    /*****************************************************************************
     * REQUETES SELECTION ********************************************************
     *****************************************************************************/

    /**
     * Retourne l'historique du plan passé en params
     * @param $planId
     * @returns données
     */
    public static function getJournalPlan($planId)
    {
//        return JournalEquipementPlan::where('plan_id', '=', $planId)->get();
        return DB::table('journal_equipement_plan')
            ->where('plan_id', '=', $planId)
            ->get();
    }

    /**
     *
     * @param $planId
     * @param $journalId
     * @return données
     */
    public static function getJournalPlanFromVersion($planId, $journalId)
    {
//        return JournalEquipementPlan::wherePlanId($planId)->where('id', '>', $journalId)->get();
        return DB::table('journal_equipement_plan')
            ->where('id', '>', $journalId)
            ->where('plan_id', '=', $planId)
            ->get();
    }

    /**
     *
     * @param $planId
     * @param $journalId
     * @return données
     */
    public static function getJournalPlacesFromVersion($planId, $journalId)
    {
        // ARTHUNG
        DB::connection()->disableQueryLog();

        $placeIds = DB::table('journal_equipement_plan')
            ->where('id', '>', $journalId)
            ->where('plan_id', '=', $planId)
            ->groupBy('place_id')
            ->lists('place_id');

        // Récup des données etat_occupation
        $etats_occup = DB::table('etat_occupation')->get();

        // Intégration des données aux places !
        $aPlace = DB::table('place')
            ->whereIn('id', $placeIds)->get();

        $retour = array_map(function ($place) use ($etats_occup) {

            // Init place retour
            $pRetour = $place;

            // Integration états occupation
            $etat_occup = array_reduce($etats_occup, function ($carry, $item) use ($place) {
                return ($place->etat_occupation_id == $item->id) ? $item : $carry;
            });
            $pRetour->etat_occupation = $etat_occup;

            // Intégration journal_équipement plan
            $pRetour->latest_journal_equipement = DB::table('journal_equipement_plan')
                ->where('place_id', $place->id)
                ->orderBy('id', 'DESC')
                ->limit('1')
                ->get()[0];
            return $pRetour;
        }, $aPlace);

        return $retour;
//        return Place::whereIn('id', $placeIds)
//            ->with('etat_occupation')
//            ->with('latest_journal_equipement')
//            ->get();
    }

    /**
     *
     * @param $planId
     * @param $journalId
     * @return données
     */
    public static function getJournalAfficheurFromVersion($planId, $journalId)
    {
        $afficheurId = JournalEquipementPlan::wherePlanId($planId)->where('id', '>', $journalId)->groupBy('afficheur_id')->lists('afficheur_id');
        return Afficheur::whereIn('id', $afficheurId)->get();
    }

    /**
     * Créé une ligne de journal de type place
     * @param $fields : champs à insérer {plan_id:1,....}
     * @return boolean
     */
    public static function createJournalPlace(array $fields)
    {
        // Variable de retour
        $bRetour = true;

        // Essai d'enregistrement
        try {
//            Log::debug('fields journal :'.print_r($fields,true));
            // Création du journal
            $newjournal = JournalEquipementPlan::create($fields);
        } catch (Exception $e) {
            $bRetour = false;
            Log::error('Rollback create journal :' . $e->getMessage());
        }

        return $bRetour;
    }


}