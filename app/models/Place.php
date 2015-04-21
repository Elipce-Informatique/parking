<?php

class Place extends \Eloquent
{
    protected $table = 'place';
    public $timestamps = false;
    protected $fillable = ['libelle', 'num', 'capteur_id', 'type_place_id', 'allee_id', 'geojson', 'bonne', 'etat_occupation_id', 'lat', 'lng'];

    /*****************************************************************************
     * INSERTION DES DONNÉES *****************************************************
     *****************************************************************************/

    /**
     * Crée les places en base de données en fonction des données de la liste passée
     * @param $places : Tableau d'objet avec les propriétés suivantes:
     * 'libelle', 'num', 'type_place_id', 'allee_id', 'geojson', 'bonne', 'etat_occupation_id', 'lat', 'lng'
     * @return boolean true ou false selon l'état de l'insertion
     */
    public static function createPlaces($places)
    {
        $retour = true;
        if (is_array($places)) {
            try {
                DB::beginTransaction();
                // Parcours des places à insérer
                foreach ($places AS $p) {
                    DB::table('place')->insert($p);
                }
                // Pas d'exception si on arrive ici
                DB::commit();
            } catch (Exception $e) {
                // Erreur SQL, on log
                Log::error('Rollback insertion des places !');
                Log::error($e);
                DB::rollBack();
                $retour = false;
            }
        } else {
            $retour = false;
        }
        return $retour;
    }

    /**
     * Maj etat d'occupation de la place
     * @param $id: ID place
     * @param $fields: champs à updater
     * @return bool
     */
    public static function updatePlace($id, $fields){
        // Retour
        $bRetour = true;

        // Champs filtrés
        $filteredFields = [];

        // Champ à enregistrer
        $aFieldsSave = array('etat_occupation_id');

        // Parcours de tous les champs
        foreach($aFieldsSave as $key){
            // On ne garde que les clés qui nous interessent
            $filteredFields[$key] = $fields[$key];
        }

        // Essai d'enregistrement
        try {
            // Modification de la place
            Place::where('id','=',$id)->update($filteredFields);
        }
        catch(Exception $e){
            Log::error('Rollback update place !', $e);
            $bRetour = false;
        }
        return $bRetour;
    }

    /**
     * Récupère la placeà partir de son numéro et de son niveau
     * @param $num: numéro de place
     * @param $niveau: niveau.id
     */
    public static function getPlaceFromNum($num, $niveau){
        return Niveau::find($niveau)
            ->join('zone', 'zone.niveau_id', '=', 'niveau.id')
            ->join('allee', 'allee.zone_id', '=', 'zone.id')
            ->join('place', 'place.allee_id', '=', 'allee.id')
            ->where('num', '=', $num)
            ->select('place.*')
            ->get()
            ->first();
    }

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
     * Le type de la place :
     * Inverse de la relation du type de la place
     * @return mixed
     */
    public function capteur()
    {
        return $this->belongsTo('Capteur');
    }

    /**
     * Le journal equipement de la place
     * @return mixed
     */
    public function journal_equipement()
    {
        return $this->hasMany('JournalEquipementParking');
    }
}