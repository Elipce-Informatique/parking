<?php

class AlerteController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.alerte');
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

        // Variable de retour
        $retour = [
            'save' => true,
            'errorBdd' => false,
            'model' => null,
        ];

        // Data postées
        $fields = Input::all();
        $fields['data'] = json_decode($fields['data'], true);
//        Log::debug('FIELDS ' . print_r($fields, true));


        try {
            // Get type alerte
            $modelType = TypeAlerte::where('code', '=', $fields['data']['code'])->first();

            $fields['type_alerte_id'] = $modelType->id;

            // Champs filtrés
            $filteredFields = [];
            // Parcours de tous les champs
            foreach (['description', 'message', 'plan_id', 'type_alerte_id', 'geojson'] as $key) {
                // On ne garde que les clés qui nous interessent
                $filteredFields[$key] = $fields[$key];
            }
            // Création alerte
            $modelAlerte = Alerte::create($filteredFields);

            $places = [];
            // Places à associer
            foreach ($fields['data']['places'] as $place) {
                $places[] = Place::find($place['id']);
            }

            // Assoc places
            $modelAlerte->places()->saveMany($places);


            $retour['model'] = $modelAlerte;
            $retour['places'] = $places;

        } catch (Exception $e) {
            Log::error('Erreur création alerte ' . $e->getMessage());
            $retour['save'] = false;
            $retour['errorBdd'] = true;
        }
        return json_encode($retour);
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


    /**
     * Toutes les alertes du parking
     *
     * @return Response
     */
    public function all($idPlan)
    {
        return TypeAlerte::with(['alertes' => function ($q) use ($idPlan){
            $q->with('places')
                ->where('plan_id', '=', $idPlan)
                ->orderBy('alerte.description');
        }])->get();
    }


}
