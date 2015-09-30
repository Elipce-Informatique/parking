<?php

class Afficheur extends BaseModel
{
    protected $fillable = [];
    protected $guarded = ['id'];
    protected $table = 'afficheur';

    /**
     * Setup des évènements du model
     */
    public static function boot()
    {
        parent::boot();

        // Attach event handler, on deleting of the user
        Afficheur::deleting(function ($aff) {
            // Delete all tricks that belong to this user
            foreach ($aff->vues as $vue) {
                $vue->delete();
            }
        });

        // Attach event handler, on deleting of the user
        Afficheur::created(function ($aff) {
            $aff->getParking()->touchAffUpdate();
        });

        // Attach event handler, on deleting of the user
        Afficheur::updated(function ($aff) {
            $aff->getParking()->touchAffUpdate();
        });
    }

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le niveau de l'afficheur
     * @return mixed
     */
    public function plan()
    {
        return $this->belongsTo('Plan');
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
     * Les configurations de cet afficheur
     * @return mixed
     */
    public function configs()
    {
        return $this->belongsToMany('ConfigEquipement', 'afficheur_config');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/

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

    /**
     * Retourne le parking parent de cet afficheur
     * @return mixed : le parking de l'afficheur
     */
    public function getParking()
    {
        return $this->plan->niveau->parking;
    }

}