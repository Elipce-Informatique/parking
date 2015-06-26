<?php

class NiveauxController extends \BaseController
{

    /**
     * Display a listing of the resource.
     * GET /niveaux
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.niveau');
    }

    /**
     * Show the form for creating a new resource.
     * GET /niveaux/create
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     *  a newly created resource in storage.
     * POST /niveaux
     *
     * @return Response
     */
    public function store()
    {

        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'upload' => true
        ];

        // Les données passées en POST
        $fields = Input::all();
//        Log::debug(print_r($fields, true));

        // Plans
        $plans = array_filter($fields, function ($value, $key) {
            return (count(explode('plan', $key)) > 1);
        }, ARRAY_FILTER_USE_BOTH);
//        Log::debug('plans: '.print_r($plans, true));

        // Début transaction
        DB::beginTransaction();
        try {

            $modelsPlan = [];
            // Parcours des plans
            foreach ($plans as $key => $plan) {

                // Save plan
                $newPlan = Plan::create(['libelle' => $plan]);

                // Save zone defaut
                $modelZone = Zone::create([
                    'libelle' => Lang::get('global.defaut'),
                    'defaut' => '1',
                    'plan_id' => $newPlan->id
                ]);

                // Save allée defaut
                $modelAllee = Allee::create([
                    'libelle' => Lang::get('global.defaut'),
                    'defaut' => '1',
                    'zone_id' => $modelZone->id
                ]);

                // Save file
                $filePostName = 'url' . explode('plan', $key)[1];
                if (Input::hasFile($filePostName)) {
                    // Fichier plan
                    $fileCourant = Input::file($filePostName);

                    // Extension
                    $extFile = $fileCourant->getClientOriginalExtension();

                    //  Nom du fichier (ID + extension)
                    $fileName = $newPlan->id . '.' . $extFile;

                    // Sauvegarde dans "documents/plans"
                    $fileCourant->move(storage_path() . '/documents/plans', $fileName);

                    // Mise à jour du champ en base de donnée
                    $newPlan->url = $fileName;
                    $newPlan->save();
                    // Ajout du plan à insérer dans le niveau
                    $modelsPlan[] = $newPlan;

                } // Le fichier n'existe pas
                else {
                    Log::error('Erreur enregistrement fichier plan. ' . $filePostName);
                    $retour['save'] = false;
                    $retour['upload'] = false;
                    break;
                }
            }

            // Plans OK (enregsitrement + upload)
            if ($retour['save']) {
                // Le libellé niveau est unique
                if (!Niveau::isLibelleExists($fields['parking_id'], $fields['libelle'])) {

                    // Création du niveau
                    $newNiveau = Niveau::create($fields);
                    // Assoc niveau et plans
                    $newNiveau->plans()->saveMany($modelsPlan);
                    $retour['model'] = Niveau::with('plans')->find($newNiveau->id);
                } // Le niveau existe
                else {
                    $retour['save'] = false;
                    Log::error("Le niveau " . $fields['libelle'] . " existe déjà. ");
                }
            }
        } catch (Exception $e) {
            Log::error("Erreur store niveau. " . $e->getMessage());
            $retour['errorBdd'] = true;
            $retour['save'] = false;
        }

        // Enregistrement BDD
        if ($retour['save']) {
            DB::commit();
        } // Enregistrement KO
        else {
            DB::rollBack();
        }

        return json_encode($retour);
    }

    /**
     * Display the specified resource.
     * GET /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        return Niveau::with('plans')->find($id);
    }

    /**
     * Display the specified resource.
     * GET /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function showWithPlaces($id)
    {
        return Niveau::with('plans.zones.allees.places.etat_occupation')->find($id);
    }


    /**
     * Show the form for editing the specified resource.
     * GET /niveaux/{id}/edit
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
     * PUT /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
            'upload' => true
        ];

        // Les données passées en PUT
        $fields = Input::all();
//        Log::debug(print_r($fields, true));

        // Plans avant modif
        $plansAvantModif = Niveau::getPlans($id)->plans;
//        Log::debug('plans avant: ' . print_r($plansAvantModif, true));

        // Plans restants après modif
        $plansApresModif = array_filter($fields, function ($value, $key) {
            return (count(explode('plan', $key)) > 1);
        }, ARRAY_FILTER_USE_BOTH);
//        Log::debug('plans apres: ' . print_r($plansApresModif, true));

        $destFolder = storage_path() . '/documents/plans';

        // Début transaction
        DB::beginTransaction();

        try {

            // Plans à supprimer
            if (count($plansAvantModif) !== count($plansApresModif)) {

                // Parcours des plans avant update
                foreach ($plansAvantModif as $avant) {
                    // Le plan n'existe plus
                    if (!array_key_exists('plan' . $avant->id, $plansApresModif)) {
                        // Supression
                        Plan::find($avant->id)->delete();
                        // Suppression du fichier
                        if (!File::delete($destFolder . '/' . $avant->url)) {
                            Log::error('Erreur suppression plan. ' . $destFolder . '/' . $avant->url);
                            $retour['save'] = false;
                            $retour['upload'] = false;
                        }
                    }
                }
            }

            $modelsPlan = [];
            // Parcours des plans
            foreach ($plansApresModif as $key => $plan) {
                $temp = explode('_new_', $key);
                // Nouveau plan
                if (count($temp) > 1) {
                    $idPlan = $temp[1];
                    // Save plan
                    $modelPlan = Plan::create(['libelle' => $plan]);

                    // Save zone defaut
                    $modelZone = Zone::create([
                        'libelle' => Lang::get('global.defaut'),
                        'defaut' => '1',
                        'plan_id' => $modelPlan->id
                    ]);

                    // Save allée defaut
                    $modelAllee = Allee::create([
                        'libelle' => Lang::get('global.defaut'),
                        'defaut' => '1',
                        'zone_id' => $modelZone->id
                    ]);

                    // Save file
                    $filePostName = 'url_new_' . $idPlan;

                } // Plan existant
                else {
                    $idPlan = explode('plan', $key)[1];
                    // Update libelle
                    $modelPlan = Plan::find($idPlan);
                    $modelPlan->libelle = $plan;
                    $modelPlan->save();

                    // Save file
                    $filePostName = 'url' . $idPlan;
                }

                // Upload
                if (Input::file($filePostName)->isValid()) {
                    // Fichier plan
                    $fileCourant = Input::file($filePostName);

                    // Extension
                    $extFile = $fileCourant->getClientOriginalExtension();

                    //  Nom du fichier Plan (ID + extension)
                    $fileName = $modelPlan->id . '.' . $extFile;

                    // Sauvegarde dans "documents/plans"
                    $fileCourant->move($destFolder, $fileName);

                    // Mise à jour du champ en base de donnée
                    $modelPlan->url = $fileName;
                    $modelPlan->save();

                    // Ajout du plan à insérer dans le niveau
                    $modelsPlan[] = $modelPlan;

                } // Le fichier n'a pas été POST
                else {
                    // Mode création ou mode edition avec modification de fichier
                    if (count($temp) > 1 || (count($temp) === 1 && $fields[$filePostName] != '')) {

                        Log::error('Erreur enregistrement fichier plan. ' . $filePostName);
                        $retour['save'] = false;
                        $retour['upload'] = false;
                        break;
                    }
                    // else mode edition sans modification de fichier

                }
            }

            // Plans OK (enregsitrement + upload)
            if ($retour['save']) {
                // Le libellé niveau est unique
                if (!Niveau::isLibelleExists($fields['parking_id'], $fields['libelle'], $id)) {
                    // Niveau à modifier
                    $modelNiveau = Niveau::find($id);
                    // Champs filtrés
                    $filteredFields = [];
                    // Parcours de tous les champs
                    foreach ($modelNiveau->getFillable() as $key) {
                        // On ne garde que les clés qui nous interessent
                        $filteredFields[$key] = $fields[$key];
                    }

                    // Update niveau
                    $modelNiveau->update($filteredFields);
                    // Assoc niveau et plans
                    $modelNiveau->plans()->saveMany($modelsPlan);
                    // Niveau à retourner
                    $retour['model'] = Niveau::with('plans')->find($id);
                } // Le niveau existe
                else {
                    $retour['save'] = false;
                    Log::error("Le niveau " . $fields['libelle'] . " existe déjà. ");
                }
            }
        } catch (Exception $e) {
            Log::error("Erreur update niveau. " . $e->getMessage());
            $retour['errorBdd'] = true;
            $retour['save'] = false;
        }

        // Enregistrement BDD
        if ($retour['save']) {
            DB::commit();
        } // Enregistrement KO
        else {
            DB::rollBack();
        }

        return json_encode($retour);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /niveaux/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        // Suppression niveau
        try {
            Niveau::find($id)->delete();
            $retour = true;
        } catch (Exception $e) {
            Log::error("Erreur suppression niveau $id " . $e->getMessage());
            $retour = false;
        }
        return json_encode($retour);
    }

    /**
     * Retourne tous les nvieaux accessibles au user connecté
     * @return string
     */
    public function all()
    {
        return json_encode(Parking::getTreeviewParking());
    }

    /**
     * Vérifie l'unicité du libellé
     * @param $libelle
     * @param string $id
     */
    public function verifLibelle($libelle, $id = '')
    {
        return json_encode(Niveau::isLibelleExists($libelle, $id));
    }

    /**
     * @param $niveauId
     */
    public function getAfficheurs($niveauId)
    {

    }


}