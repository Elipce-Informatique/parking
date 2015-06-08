<?php

class TypePlace extends BaseModel
{
    protected $table = 'type_place';
    protected $fillable = [];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    /**
     * Les places associés à ce type_place
     * @return mixed
     */
    public function places()
    {
        return $this->hasMany('Place');
    }

    /**
     * Les places associés à ce type_place
     * @return mixed
     */
    public function etats_occupations()
    {
        return $this->hasMany('EtatsDoccupation');
    }


    /*
    |--------------------------------------------------------------------------
    | MÉTHODES MÉTIER
    |--------------------------------------------------------------------------
    */

    /**
     * @return un tableau associatif
     * [
     *      id => 'libelle'
     * ]
     */
    public static function getAssocIdLibelle()
    {
        $temp = TypePlace::all();
        $retour = [];
        foreach ($temp As $t) {
            $retour[$t->id] = $t->libelle;
        }
        return $retour;
    }

    /**
     * @return un tableau associatif
     * [
     *      id => {type_place}
     * ]
     */
    public static function getAssocIdType()
    {
        $temp = TypePlace::all();
        $retour = [];
        foreach ($temp As $t) {
            $retour[$t->id] = $t;
        }
        return $retour;
    }


}