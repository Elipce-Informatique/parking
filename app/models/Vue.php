<?php

class Vue extends \Eloquent
{

    protected $table = 'vue';
    protected $guarded = ['id'];

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