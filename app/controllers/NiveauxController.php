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
     * Store a newly created resource in storage.
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
                    $retour['model'] = $newNiveau;
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
        if($retour['save']){
            DB::commit();
        }
        // Enregistrement KO
        else{
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
        //
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
        //
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


}