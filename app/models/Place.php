<?php

class Place extends BaseModel
{
    protected $table = 'place';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * L'allée de la place :
     * Inverse de la relation de l'allée
     * @return mixed
     */
    public function allee()
    {
        return $this->belongsTo('Allee');
    }

    /**
     * Le type de la place :
     * Inverse de la relation du type de la place
     * @return mixed
     */
    public function type_place()
    {
        return $this->belongsTo('TypePlace');
    }

    /**
     * L'état d'occupation de la place :
     * Inverse de la relation de l'état d'occupation
     * @return mixed
     */
    public function etat_occupation()
    {
        return $this->belongsTo('EtatsDoccupation');
    }

    /**
     * Le capteurde la place
     * @return mixed
     */
    public function capteur()
    {
        return $this->belongsTo('Capteur');
    }

    /**
     * Les journal equipement de la place
     * @return mixed
     */
    public function journal_equipement()
    {
        return $this->hasMany('JournalEquipementPlan');
    }

    /**
     * Le dernier journal equipement de la place
     * @return mixed
     */
    public function latest_journal_equipement()
    {
        return $this->hasOne('JournalEquipementPlan')->latest();
    }

    /**
     * Tables d'association alerte_place
     * @return mixed
     */
    public function alertes()
    {
        return $this->belongsToMany('Alerte');
    }

    /*****************************************************************************
     * INSERTION DES DONNÉES *****************************************************
     *****************************************************************************/

    /**
     * Crée les places en base de données en fonction des données de la liste passée
     * @param $places : Tableau d'objet avec les propriétés suivantes:
     * 'libelle', 'num', 'type_place_id', 'allee_id', 'geojson', 'bonne', 'etat_occupation_id', 'lat', 'lng'
     * @return array les places insérées
     */
    public static function createPlaces($places)
    {
        $retour = [];
        if (is_array($places)) {
            try {
                DB::beginTransaction();
                // Parcours des places à insérer
                foreach ($places AS $p) {
                    Log::debug('Data place à insérer : ' . print_r($p, true));
                    $pBdd = Place::create($p);
                    $retour [] = Place::find($pBdd->id);
                }
                // Pas d'exception si on arrive ici
                DB::commit();
            } catch (Exception $e) {
                // Erreur SQL, on log
                Log::error('Rollback insertion des places !');
                Log::error($e);
                DB::rollBack();
                $retour = [];
            }
        } else {
            $retour = [];
        }
        return $retour;
    }

    /**
     * Maj de la place
     * @param $id : ID place
     * @param $fields : fields to update
     * @return bool
     */
    public static function updatePlace($id, $fields)
    {
        // Retour
        $bRetour = true;

        // Essai d'enregistrement
        try {
            // Modification de la place
            Place::where('id', '=', $id)->update($fields);
        } catch (Exception $e) {
            Log::error('Rollback update place !', $e);
            $bRetour = false;
        }
        return $bRetour;
    }

    /**
     * Récupère la placeà partir de son numéro et de son niveau
     * @param $num : numéro de place
     * @param $plan : plan.id
     */
    public static function getPlaceFromNumAndPlan($num, $plan)
    {
        return Plan::where('plan.id', '=', $plan)
            ->join('zone', 'zone.plan_id', '=', 'plan.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->leftJoin('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('num', '=', $num)
            ->select('place.*', 'etat_occupation.is_occupe')
            ->get()
            ->first();
    }

    /**
     * Calcule si une place est occupée ou pas
     * @param $id : place.id
     * @return bool
     */
    public static function isOccupied($id)
    {
        $place =  Place::where('place.id', '=', $id)
            ->leftJoin('etat_occupation', 'etat_occupation.id', '=', 'place.etat_occupation_id')
            ->where('etat_occupation.is_occupe','=','1')
            ->get();

        return count($place) == 1;
    }
}