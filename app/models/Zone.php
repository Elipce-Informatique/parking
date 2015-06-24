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

                // 1 - RÉCUP DE L'ID DU PLAN
                $planId = Zone::where('id', '=', $zoneId)
                    ->select('plan_id')
                    ->first()->plan_id;

                // 2 - RÉCUP ID ZONE PAR DÉFAUT DU PLAN PARENT
                $defaultZoneId = Zone::where('plan_id', '=', $planId)
                    ->where('defaut', '=', '1')
                    ->select('id')
                    ->first()->id;

                // 3 - RÉCUP ID ALLEE PAR DÉFAUT DU PLAN PARENT
                $defaultAlleeId = Allee::where('zone_id', '=', $defaultZoneId)
                    ->where('defaut', '=', '1')
                    ->select('id')
                    ->first()->id;

                // 4 - RÉCUP ID ALLÉE DÉFAUT DE LA ZONE A SUPPR
                $defaultAlleeSupprId = Allee::where('zone_id', '=', $zoneId)
                    ->where('defaut', '=', '1')
                    ->select('id')
                    ->first()->id;

                // 5 - UPDATE DES PLACES SOUS L'ALLÉE PAR DÉFAUT DE LA ZONE À SUPPRIMER
                Place::where('allee_id', '=', $defaultAlleeSupprId)
                    ->update(array('allee_id' => $defaultAlleeId));

                // 6 - UPDATE DES ALLÉES SOUS LA ZONE À SUPPRIMER
                Allee::where('zone_id', '=', $zoneId)
                    ->update(array('zone_id' => $defaultZoneId));

                // 7 - Suppression de la zone
                Zone::destroy($zoneId);
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