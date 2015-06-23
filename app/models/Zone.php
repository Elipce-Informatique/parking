<?php

class Zone extends BaseModel
{
    protected $table = 'zone';
    protected $guarded = ['id'];

    /*****************************************************************************
     * RELATIONS DU MODELE *******************************************************
     *****************************************************************************/

    /**
     * Les allées de la zone
     * @return mixed
     */
    public function allees()
    {
        return $this->hasMany('Allee');
    }

    /**
     * Le plan de la zone :
     * Inverse de la relation du niveau
     * @return mixed
     */
    public function plan()
    {
        return $this->belongsTo('Plan');
    }

    /*****************************************************************************
     * INSERTION DES DONNÉES *****************************************************
     *****************************************************************************/

    /**
     * Supprime les zones désignées par les ids fournis
     * @param array $ids
     * @return boolean
     */
    public static function deleteZones(array $ids)
    {
        $retour = true;
        try {
            DB::beginTransaction();

            foreach ($ids as $zoneId) {
                // 1 - RÉCUP ID ZONE PAR DÉFAUT DU PLAN PARENT
                $defaultZoneId = Zone::where('id', '=', $zoneId)
                    //->where('defaut', '=', 1) TODO
                    ->select('id')
                    ->first()->id;
                // 2 - RÉCUP ID ALLEE PAR DÉFAUT DU PLAN PARENT

                // 3 - UPDATE DES PLACES SOUS L'ALLÉE PAR DÉFAUT DE LA ZONE À SUPPRIMER
//                Place::where('allee_id', '=', $alleeId)
//                    ->update(array('allee_id' => $alleeDefautId));
//
//                // 3 - SUPPRESSION DE L'ALLÉE
//                Allee::destroy($alleeId);
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