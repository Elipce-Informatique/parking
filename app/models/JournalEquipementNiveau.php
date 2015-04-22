<?php

class JournalEquipementNiveau extends \Eloquent
{
    protected $fillable = [];
    protected $table = "journal_equipement_niveau";
    public $timestamps = true;


    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le niveau de cette entrée de journal
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
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
     * Retourne l'historique du niveau passé en params
     * @param $niveauId
     * @returns données
     */
    public static function getJournalNiveau($niveauId)
    {
        return JournalEquipementNiveau::where('niveau_id', '=', $niveauId)->get();
    }

    /**
     *
     * @param $niveauId
     * @param $journalId
     * @return données
     */
    public static function getJournalNiveauFromVersion($niveauId, $journalId)
    {
        return JournalEquipementNiveau::whereNiveauId($niveauId)->where('id', '>', $journalId)->get();
    }

    /**
     *
     * @param $niveauId
     * @param $journalId
     * @return données
     */
    public static function getJournalPlacesFromVersion($niveauId, $journalId)
    {
        $placeIds = JournalEquipementNiveau::whereNiveauId($niveauId)
            ->where('id', '>', $journalId)
            ->groupBy('place_id')
            ->lists('place_id');

        return Place::whereIn('id', $placeIds)
            ->with('etat_occupation')
            ->with('latest_journal_equipement')
            ->get();
    }

    /**
     *
     * @param $niveauId
     * @param $journalId
     * @return données
     */
    public static function getJournalAfficheurFromVersion($niveauId, $journalId)
    {
        $afficheurId = JournalEquipementNiveau::whereNiveauId($niveauId)->where('id', '>', $journalId)->groupBy('afficheur_id')->lists('afficheur_id');
        return Afficheur::whereIn('id', $afficheurId)->get();
    }

    /**
     * Créé une ligne de journal de type place
     * @param $fields : champs à insérer {niveau_id:1,....}
     * @return boolean
     */
    public static function createJournalPlace($fields)
    {
        // Variable de retour
        $bRetour = true;

        // Champs filtrés
        $filteredFields = [];

        // Champ à enregistrer
        $aFieldsSave = array('niveau_id', 'place_id', 'etat_occupation_id');

        // Parcours des champs à enregistrer
        foreach ($aFieldsSave as $key) {
            // On ne garde que les clés qui nous interessent
            $filteredFields[$key] = $fields[$key];
        }

        // Essai d'enregistrement
        try {
            // Création du journal
            $newjournal = JournalEquipementNiveau::create($filteredFields);
        } catch (Exception $e) {
            $bRetour = false;
        }

        return $bRetour;
    }


}