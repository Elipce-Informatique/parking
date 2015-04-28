<?php

class EtatsDoccupation extends Eloquent
{
    public $timestamps = false;

    protected $fillable = ['libelle','couleur','type_place_id','is_occupe'];
    protected $table = 'etat_occupation';

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    /**
     * Le type place associé à cet état d'occupation :
     * @return mixed
     */
    public function type_place()
    {
        return $this->belongsTo('TypePlace');
    }

    /**
     * L'état de place associé à cet état d'occupation :
     * @return mixed
     */
    public function etat_place()
    {
        return $this->belongsTo('EtatPlace');
    }

    /**
     * Le journal equipement de l'état d'occupation
     * @return mixed
     */
    public function journal_equipement()
    {
        return $this->hasMany('JournalEquipementParking');
    }

    /*
    |--------------------------------------------------------------------------
    | TODO : CODE CI DESSOUS A REVOIR ENTIEREMENT QUAND ON AURA LE TEMPS !!
    |--------------------------------------------------------------------------
    */
    /*
     * Récupère tout les états d'occupation
     * ['id', 'libelle', 'couleur', 'type_place.libelle', 'etat_place.libelle']
     */
    public static function getAll()
    {
        $res = DB::table('etat_occupation')
            ->leftJoin('type_place', function ($join) {
                $join->on('etat_occupation.type_place_id', '=', 'type_place.id');
            })
            ->groupBy('etat_occupation.id')
            ->get(['etat_occupation.id', 'etat_occupation.libelle', 'etat_occupation.couleur', 'type_place.libelle as type_place', 'etat_occupation.is_occupe as etat_place', 'type_place.logo']);
        return $res;
    }

    /*
     * Récupère un état d'occupation
     * ['id', 'libelle', 'couleur', 'type_place.id', 'etat_place.id']
     */
    public static function getInfosEtatById($id)
    {
        /* Récupération des données pour un état */
        if ($id != 0) {
            $resEtat = EtatsDoccupation::where('etat_occupation.id', '=', $id)
                ->leftJoin('type_place', 'etat_occupation.type_place_id', '=', 'type_place.id')
                ->groupBy('etat_occupation.id')
                ->get(['etat_occupation.*','type_place.logo'])
                ->first();
        } /* Récupération des données pour une création d'état */
        else {
            $resEtat = [
                'libelle' => '',
                'couleur' => 'FFFFFF',
                'type_place_id' => '',
                'is_occupe' => '1'
            ];
        }
        // Données etat d'occupation
        return $resEtat;
    }

    /*
     * Retourne si ce libelle existe déjà ou pas
     */
    public static function getLibelleExist($libelle)
    {
        $etat = DB::table('etat_occupation')->where('libelle', $libelle)->first(['id']);
        return empty($etat);
    }

    /**
     * Créé un etat d'oocupation
     * @param $fields: champs à insérer
     * @return array
     */
    public static function createNew($fields)
    {
        $retour = array('save' => false, 'errorBdd' => false);

        /* Vérifie que l'utilisateur n'existe pas */
        $libelleExists = EtatsDoccupation::getLibelleExist($fields['libelle']);

        if ($libelleExists) {

            try {
                // Création
                $newEtat = EtatsDoccupation::create($fields);
                $retour = array('save' => true, 'errorBdd' => false, 'id' => $newEtat->id);
            }
            catch(Exception $e){
                $retour = array('save' => false, 'errorBdd' => true);
            }
        }

        return $retour;
    }

    /**
     * Update etat d'occupation
     * @param $id: ID à updater
     * @param $fields: champ de l'update
     * @return array
     */
    public static function updateEtatDoccupation($id, $fields)
    {
        Log::debug(print_r($fields,true));
        $retour = ['save' => true, 'id' => $id];
        // Essai d'enregistrement
        try {
            // Création du jour
            EtatsDoccupation::where('id','=',$id)->update($fields);
        }
        catch(Exception $e){
            $retour['save'] = false;
            Log::error($e->getMessage());
        }

        return $retour;
    }

    /*
     * Suppression d'un état d'occupation
     */
    public static function deleteEtatDoccupation($id)
    { // Variables
        $bSave = true;

        // Chercher l'état d'occupataion
        $etat = EtatsDoccupation::find($id);

        // Supprimer l'état d'occupataion
        try {
            $etat->delete();
        } catch (Exception $e) {
            $bSave = false;
        }
        return $bSave;
    }

    /**
     * Calcule l'état d'occupation en fonction d'un type de place et de l'occupation
     * @param $type: ID type_place
     * @param $isOccupe: boolean
     * @return mixed
     */
    public static function getEtatFromTypeAndOccupation($type, $isOccupe){
        return EtatsDoccupation::where('is_occupe','=',$isOccupe)
            ->where('type_place_id','=',$type)
            ->select('*')
            ->get()
            ->first();
    }
}
