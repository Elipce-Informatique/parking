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

}