<?php

class EtatsDoccupation extends Eloquent
{
    public $timestamps = false;

    protected $fillable = ['libelle'];
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
                'etat_place_id' => '',
                'logo' => ''
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
        return array('good' => empty($etat));
    }

    /*
     * Crée un état d'occupation
     */
    public static function creerEtatOccupation($fields)
    {
        $retour = array('save' => false, 'errorBdd' => false);

        /* Vérifie que l'utilisateur n'existe pas */
        $res = EtatsDoccupation::getLibelleExist($fields['libelle']);

        if ($res['good'] == true) {

            // Récupère la donnée de l'utilisateur
            $fieldDataOccupation = [];
            $fieldDataOccupation['libelle'] = $fields['libelle'];
            $fieldDataOccupation['couleur'] = $fields['couleur'];
            $fieldDataOccupation['type_place_id'] = $fields['type_place_id'];
            $fieldDataOccupation['etat_place_id'] = $fields['etat_place_id'];

            // Création
            $idEtatOccupation = DB::table('etat_occupation')->insertGetId($fieldDataOccupation);


            if ($idEtatOccupation > 0)
                $retour = array('save' => true, 'errorBdd' => false, 'id' => $idEtatOccupation);
            else
                $retour = array('save' => false, 'errorBdd' => true);
        }

        return $retour;
    }

    /*
     * Mise à jour d'un état d'occupation
     */
    public static function updateEtatDoccupation($id, $fields)
    {
        // Trouver l'état d'occupation
        $oDataOccupation = EtatsDoccupation::find($id);
        // Modifier l'état d'occupation
        $oDataOccupation->libelle = $fields['libelle'];
        $oDataOccupation->couleur = $fields['couleur'];
        $oDataOccupation->type_place_id = $fields['type_place_id'];
        $oDataOccupation->etat_place_id = $fields['etat_place_id'];
        // Sauvegarder l'état d'occupation
        $bSave = $oDataOccupation->save();

        return ['save' => $bSave];
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
