<?php

class SimulatorController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Libére ou occupe des places de parking sur le plan $id
     *
     * @param  int $id : ID plan
     * @return Response
     */
    public function show($id)
    {
        $retour = true;
        // Toutes les places du parking $id
        $places = Plan::getPlaces($id);

        // Min et max des places
        $min = 0;
        $max = Plan::getMaxPlace($id);
//        Log::debug('random max: '.$max);

        // Nb aléatoire de places qui bougent
        $nb = mt_rand(5, 15);

        try {
            DB::beginTransaction();

            // Parcours des places à modifier
            for ($i = 0; $i < $nb; $i++) {
                // Place aléatoire
                $numPlace = mt_rand($min, $max);

                // ID place
                $oPlace = Place::getPlaceFromNum($numPlace, $id);
                $idPlace = $oPlace->id;
//                Log::debug('num place: '.$numPlace. ' id place: '.$idPlace);

                // Etat d'occupation courrant
                $etatCourant = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, $oPlace->is_occupe);

                // Etat d'occupation inverse
                $etatNew = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, !$oPlace->is_occupe);
                if (!$etatNew) {
                    $etatNew = $etatCourant;
                }
//                Log::debug('OLD: '.$etatCourant->libelle.' NEW: '.$etatNew->libelle);

                // Modification place
                if (!Place::updatePlace($idPlace, ['etat_occupation_id' => $etatNew->id])) {
                    Log::error('Rollback simulator update place: ' . $idPlace);
                    $retour = false;
                    break;
                }
                // Journal
                if (!JournalEquipementPlan::createJournalPlace([
                    'plan_id' => $id,
                    'place_id' => $idPlace,
                    'etat_occupation_id' => $etatNew->id,
                    'date_evt' => date('Y-m-d H:i:s')
                ])
                ) {
                    Log::error('Rollback simulator insert journal: ' . $idPlace);
                    $retour = false;
                    break;
                }
            }
            // Pas d'exception si on arrive ici
            DB::commit();
        } catch (Exception $e) {
            // Erreur SQL, on log
            Log::error('Rollback simulator !' . $e->getMessage());
            $retour = false;
        }
        // Pas d'insertions
        if (!$retour) {
            DB::rollBack();
        }
        return json_encode($retour);
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public
    function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public
    function update($id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public
    function destroy($id)
    {
        //
    }

    /**
     * Init des statistiques pour la foire
     * @param $id: ID plan
     * @return string|void
     */
    public function foire($id)
    {

        // Variables
        $bool = true;
        $date = Carbon::create(2015, 6, 1, 9, 0, 0);
        $fin = Carbon::create(2015, 6, 7, 19, 0, 0);
        $retour = true;

        // Toutes les places du plan
        $places = Plan::getPlaces($id);

        // Min et max des places
        $min = 1;
        $max = Plan::getMaxPlace($id);

        DB::beginTransaction();

        while ($bool) {
//            echo 'RIGHT '.$date->day.'<br>';
            // lundi
            switch ($date->day) {
                // lundi 10h soit 36000s
                case 1:
                    $crenau = [120, 60, 120];
                    break;
                // mardi, jeudi
                case 2:
                case 4:
                    $crenau = [310, 90, 350];
                    break;
                // mercredi
                case 3:
                    $crenau = [205, 226, 694];
                // vendredi
                case 5:
                    $crenau = [480, 153, 492];
                    break;
                // samedi
                case 6:
                    $crenau = [501, 350 ,499];
                    break;
                // dimanche
                default:
                    $crenau = [0, 0, 0];
                    break;
            }
            // Parcours des crénaux horaires
            foreach($crenau as $key => $nb) {
                switch($key){
                    case 0:
                        $randMin = 0;
                        $randMax = 10800; // nb secondes de 9à 12h
                        break;
                    case 1:
                        $randMin = 10801;
                        $randMax = 18000; // 12 à 14h
                        break;
                    case 2:
                        $randMin = 18001;
                        $randMax = 43200; // 14 à 21h
                        break;
                    default:
                        break;
                }
                // Parcours du nombre d'insertions
                for ($i = 0; $i < $nb; $i++) {
                    // Simulatiojn de la date /heure
                    $copie = clone $date;
                    $copie = $copie->addSeconds(mt_rand($randMin, $randMax));

                    // Place aléatoire
                    $numPlace = mt_rand($min, $max);

                    // ID place
                    $oPlace = Place::getPlaceFromNum($numPlace, $id);

                    // Etat d'occupation courrant
                    $etatCourant = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, $oPlace->is_occupe);

                    // Etat d'occupation inverse
                    $etatNew = EtatsDoccupation::getEtatFromTypeAndOccupation($oPlace->type_place_id, !$oPlace->is_occupe);
                    if (!$etatNew) {
                        $etatNew = $etatCourant;
                    }
//                Log::debug('OLD: '.$etatCourant->libelle.' NEW: '.$etatNew->libelle);
                    // Journal
                    if (!JournalEquipementPlan::createJournalPlace([
                        'plan_id' => $id,
                        'place_id' => $oPlace->id,
                        'etat_occupation_id' => $etatNew->id,
                        'date_evt' => $copie->toDateTimeString()
                    ])) {
                        Log::error('Rollback simulator insert journal: ' . $oPlace->id);
                        DB::rollBack();
                        return false;
                    }
                }
            }
            // Add 1 day
            $date = $date->addDay();
            // Flag
            if ($date->gte($fin)) {
                $bool = false;
            }
        }

       DB::commit();
        return json_encode(true);
    }

    /**
     * Création aléatoire de capteurs sur les BUS ID de 1 à 8
     * @return string
     */
    public function capteurs(){

        DB::beginTransaction();
        // Parcours des ID de bus
        for($i=1; $i<=8; $i++){
            // Combien de noeud sur le bus
            $nb = mt_rand(120, 250);
            // Parcours des noeuds à creer
            for($j=1; $j<=$nb; $j++) {
                try {
                    Capteur::create([
                        'bus_id' => $i,
                        'num_noeud' => $j,
                        'adresse' => $j,
                    ]);
                } catch (Exception $e) {
                    Log::error('erreur creation capteurs ' . $e->getMessage());
                    DB::rollBack();
                    return json_encode(false);
                }
            }
        }
        DB::commit();
        return json_encode(true);
    }


}
