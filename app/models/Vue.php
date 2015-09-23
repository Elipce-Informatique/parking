<?php

class Vue extends \Eloquent
{

    protected $table = 'vue';
    protected $guarded = ['id'];

    /**
     * Setup des évènements du model
     */
    public static function boot()
    {
        parent::boot();

        // Attach event handler, on deleting of the user
        Vue::deleting(function ($vue) {
            // Delete all tricks that belong to this user
            $vue->compteur->delete();
        });

        // Attach event handler, on deleting of the user
        Vue::created(function ($vue) {
            // Delete all tricks that belong to this user
            $vue->getParking()->touchAffUpdate();
        });

        // Attach event handler, on deleting of the user
        Vue::updated(function ($vue) {
            // Delete all tricks that belong to this user
            $vue->getParking()->touchAffUpdate();
        });
    }

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Le compteur associé à la vue
     * @return mixed
     */
    public function compteur()
    {
        return $this->belongsTo('Compteur');
    }

    /**
     * L'afficheur associé à la vue
     * @return mixed
     */
    public function afficheur()
    {
        return $this->belongsTo('Afficheur');
    }

    /**
     * L'afficheur associé à la vue
     * @return mixed
     */
    public function type_place()
    {
        return $this->belongsTo('TypePlace');
    }

    /*****************************************************************************
     * UTILITAIRES DU MODELE *****************************************************
     *****************************************************************************/

    /**
     * Retourne le parking parent de cette vue
     * @return mixed : le parking de la vue
     */
    public function getParking()
    {
        return $this->afficheur->getParking();
    }
}