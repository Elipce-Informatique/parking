<?php
/**
 * Created by PhpStorm.
 * User: vivian
 * Date: 19/02/2015
 * Time: 15:14
 */

class CalendrierJours extends Eloquent
{

    /*
    |--------------------------------------------------------------------------
    | ATTRIBUTS
    |--------------------------------------------------------------------------
    */
    public $timestamps = false;

    protected $fillable = ['libelle', 'ouverture', 'fermeture','couleur'];
    protected $table='jour_calendrier';

    /**
     * Calcule tous les jours prédéfinis existants
     */
    public static function getJoursPredefinis(){
        $res = CalendrierJours::all(array('id', 'libelle', 'ouverture', 'fermeture','couleur'));
        return $res;
    }

    /**
     * Calcule les infos du jour prédéfini passé en param
     * @param $id: ID table jour_calendrier
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public static function getInfosJoursPredefinis($id){

        $res = CalendrierJours::find($id);
        return $res;
    }

    /**
     * calcule si le libelle passé en param existe déjà
     * @param $libelle: libellé à vérifier
     * @param string $id: ID à ne pas prendre en compte lors de la vérif (mode édition)
     * @return bool
     */
    public static function isLibelleExists($libelle, $id=''){
        $and = $id === '' ? '' : "and id <> $id";
        $result = CalendrierJours::whereRaw("libelle = '$libelle' $and")->count();
//        dd($result);
        return ($result > 0);
    }

    /*
   * Crée un jour prédéfini
   */
    public static function createCalendrierJour($fields){
        // Variable de retour
        $retour = array('save' => false, 'errorBdd' => false, 'obj'=>null);

        /* Vérifie que le jour n'existe pas */
        $bJourExists = CalendrierJours::isLibelleExists($fields['libelle']);

        // Le jour n'existe pas en BDD
        if (!$bJourExists) {
            // Champs filtrés
            $filteredFields = [];

            // Champ à enregistrer
            $aFieldsSave = array('libelle', 'ouverture', 'fermeture', 'couleur');

            // Parcours des champs à enregistrer
            foreach($aFieldsSave as $key){
                // On ne garde que les clés qui nous interessent
                $filteredFields[$key] = $fields[$key];
            }

            // Essai d'enregistrement
            try {
                // Création du jour
                $newDay = CalendrierJours::create($filteredFields);
//                Log::warning(print_r($newDay,true));
                $retour['save'] = true;
                $retour['obj'] = $newDay;
            }
            catch(Exception $e){
                $retour['errorBdd'] = true;
            }
        }
        return $retour;
    }

    /*
     * Suppression d'un jour prédéfini
     */
    public static function deleteCalendrierJour($id){
        // Variables
        $bSave = true;

        // Chercher l'état d'occupataion
        $etat = CalendrierJours::find($id);

        // Supprimer l'état d'occupataion
        try {
            $etat->delete();
        }
        catch (Exception $e) {
            $bSave = false;
        }
        return $bSave;
    }

    /**
     * Modifie un jour prédéfini
     * @param $id: id jour_calendrier à modifier
     * @param $fields: champs concernés par la modif
     * @return array
     */
    public static function updateCalendrierJour($id, $fields){
        // Variable de retour
        $retour = array('save' => false, 'errorBdd' => false, 'obj'=>null);

        /* Vérifie que le jour n'existe pas */
        $bJourExists = CalendrierJours::isLibelleExists($fields['libelle'], $id);

        // Le jour n'existe pas en BDD
        if (!$bJourExists) {
            // Champs filtrés
            $filteredFields = [];

            // Champ à enregistrer
            $aFieldsSave = array('libelle', 'ouverture', 'fermeture', 'couleur');

            // Parcours de tous les champs
            foreach($aFieldsSave as $key){
                // On ne garde que les clés qui nous interessent
                $filteredFields[$key] = $fields[$key];
            }

            // Essai d'enregistrement
            try {
                // Création du jour
                CalendrierJours::where('id','=',$id)->update($filteredFields);
                $retour['save'] = true;
            }
            catch(Exception $e){
                $retour['errorBdd'] = true;
            }
        }
        return $retour;
    }
}