<?php

class AfficheursController extends \BaseController
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
        $input = Input::only(
            'reference',
            'bus_id',
            'manufacturer',
            'model_name',
            'serial_number',
            'software_version',
            'hardware_version',
            'plan_id',
            'ligne',
            'lat',
            'lng');
        Log::debug('Données de l\'afficheur à insérer : ' . print_r($input, true));
        $afficheur = Afficheur::create($input);
        return $afficheur;
    }


    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    public function setGeometry($id)
    {
        Log::debug('Données reçues en PHP : ' . print_r(Input::all(), true));

        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'doublon' => false
        ];

        try {
            Afficheur::find($id)->update([
                'ligne' => Input::get('ligne'),
                'lat' => Input::get('lat'),
                'lng' => Input::get('lng'),
                'plan_id' => Input::get('plan_id')
            ]);
            $retour['model'] = Afficheur::find($id);
        } catch (Exception $e) {
            Log::error('Erreur SQL : ');
            Log::error($e);
            $retour['save'] = false;
            $retour['errorBdd'] = true;
        }
        return $retour;
    }

    /**
     * Délocalise les afficheurs de la carte
     * @return array
     */
    public function delocateMany()
    {
        Log::debug('locateMany, avec ces données : ' . print_r(Input::all(), true));
        $ids = explode(',', Input::get('ids'));
        $action = Afficheur::whereIn('id', $ids)
            ->delete();

//        $action = Afficheur::whereIn('id', $ids)
//            ->update([
//                'plan_id' => null,
//                'ligne' => null,
//                'lat' => null,
//                'lng' => null
//            ]);
        $retour = [
            'save' => $action,
            'errorBdd' => !$action,
            'model' => null,
            'doublon' => false
        ];
        return $retour;
    }


    /**
     * Receive an update display and get new information
     * @return mixed
     */
    public function updateAfficheurs()
    {

        $ids = Input::get('ids');
//        Log::debug("IDS ".print_r($ids, true));
        return json_encode(Afficheur::getInfosFromViewId($ids));
    }

    /**
     * Crée les compteurs et les vues pour cet afficheur.
     *
     * @param $id : id de l'afficheur à initialiser
     */
    public function setCountersViews($id)
    {
        $data = json_decode(Input::get('data'), true);

        Log::debug('Voici les données de l\'afficheur : ' . print_r($data, true));


        DB::beginTransaction();

        try {
            $afficheur = Afficheur::find($id);
            // Parcours des compteurs à afficher
            foreach ($data AS $counter) {
                $typePlace = TypePlace::find($counter['type_place']);

                // 1 - CRÉATION DES COMPTEURS
                $compteur = Compteur::create([
                    'libelle' => $counter['aff_libelle'] . '_compteur_' . $typePlace->libelle
                ]);

                // 2 - ASSOCIATION COMPTEURS - CAPTEURS
                $compteur->capteurs()->attach($counter['capteurs_ids']);

                // 3 - AJOUT DU v4_id DU COMPTEUR
                $compteur->v4_id = $compteur->id;
                $compteur->save();

                // 4 - CRÉATION VUE ATTACHÉE AUX COMPTEURS
                $vue = Vue::create([
                    'libelle' => $counter['aff_libelle'] . '_vue_' . $typePlace->libelle,
                    'compteur_id' => $compteur->id,
                    'afficheur_id' => $afficheur->id,
                    'cellNr' => $typePlace->cell_nb,
                    'total' => count($counter['capteurs_ids']),
                    'occupees' => 0,
                    'libres' => count($counter['capteurs_ids']),
                    'offset' => 0,
                    'emptyLow' => 0,
                    'emptyHigh' => 0,
                    'fullLow' => 0,
                    'fullHigh' => 0,
                    'type_place_id' => $counter['type_place']
                ]);

                // 5 - AJOUT DU v4_id DE LA VUE
                $vue->v4_id = $vue->id;
                $vue->save();
                DB::commit();
            }
        } catch (Exception $e) {
            Log::error('ERREUR D INSERTION COMPTEURS VUES :');
            Log::error($e);
            DB::rollBack();
            return json_encode(false);
        }


    }

}
