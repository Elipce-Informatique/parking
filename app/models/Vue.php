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

}