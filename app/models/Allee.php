<?php

class Allee extends BaseModel
{
    protected $table = 'allee';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les places de l'allée
     * @return mixed
     */
    public function places()
    {
        return $this->hasMany('Place');
    }

    /**
     * La zone de l'allée :
     * Inverse de la relation de la zone
     * @return mixed
     */
    public function zone()
    {
        return $this->belongsTo('Zone');
    }

    /*****************************************************************************
     * INSERTION DES DONNÉES *****************************************************
     *****************************************************************************/

    /**
     * Supprime les allées désignées par les ids fournis
     * @param array $ids
     * @return boolean
     */
    public static function deleteAllees(array $ids)
    {
        $retour = true;
        try {
            DB::beginTransaction();

            foreach ($ids as $alleeId) {
                // 1 - RÉCUP ID ALLÉES PAR DÉFAUT DE LA ZONE PARENTE
                $alleeDefautId = Allee::where('zone_id', '=', Allee::find($alleeId)->zone_id)
                    ->where('defaut', '=', 1)
                    ->select('id')
                    ->first()->id;

                // 2 - UPDATE DES PLACES SOUS L'ALLÉE À SUPPRIMER
                Place::where('allee_id', '=', $alleeId)
                    ->update(array('allee_id' => $alleeDefautId));

                // 3 - SUPPRESSION DE L'ALLÉE
                Allee::destroy($alleeId);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e);
            $retour = false;
        }
        return $retour;
    }
}