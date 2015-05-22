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
            'model' => null
        ];

        // Les données passées en POST
        $fields = Input::all();
        Log::debug(print_r($fields,true));

        // Le niveau n'existe pas en BDD
        if (!Niveau::isLibelleExists($fields['parking_id'], $fields['libelle'])) {

            // Essai d'enregistrement
            try {
                // Création du jour
                $retour['model'] = Niveau::create($fields);
            }
            catch(Exception $e){
                Log::error('Erreur de création niveau : '.$e->getMessage());
                $retour['errorBdd'] = true;
                $retour['save'] = false;
            }
        }
        // Le niveau existe
        else{
            $retour['save'] = false;
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