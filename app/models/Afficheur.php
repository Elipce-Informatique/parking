<?php

class Afficheur extends BaseModel
{
    protected $fillable = [];
    protected $guarded = ['id'];
    protected $table = 'afficheur';

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le niveau de l'afficheur
     * @return mixed
     */
    public function niveau()
    {
        return $this->belongsTo('Niveau');
    }

    /**
     * Le type de l'afficheur
     * @return mixed
     */
    public function type()
    {
        return $this->belongsTo('Type_afficheur');
    }

    /**
     * Le bus de l'afficheur
     * @return mixed
     */
    public function concentrateur()
    {
        return $this->belongsTo('Bus');
    }


    /**
     * Le journal equipement de l'afficheur
     * @return mixed
     */
    public function journal_equipement()
    {
        return $this->hasMany('JournalEquipementParking');
    }

    /**
     * Les vues qui affichées sur cet afficheur
     * @return mixed
     */
    public function vues()
    {
        return $this->hasMany('Vue');
    }

    /**
     * Retourne les infos afficheurs en fonction d'un tableau ID afficheur
     * @param array $aId : tableau ID afficheurs
     * @return mixed
     */
    public static function getInfosFromViewId(array $aId)
    {
        return Afficheur::with('vues.type_place')
            ->whereIn('id', function ($query) use ($aId) {
                $query->from('afficheur')
                    ->join('vue', 'vue.afficheur_id', '=', 'afficheur.id')
                    ->whereIn('vue.id', $aId)
                    ->select('afficheur.id');
            })
            ->get();

    }

}