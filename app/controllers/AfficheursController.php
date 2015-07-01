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
        //
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
            ->update([
                'plan_id' => null,
                'ligne' => null,
                'lat' => null,
                'lng' => null
            ]);
        $retour = [
            'save' => $action,
            'errorBdd' => !$action,
            'model' => null,
            'doublon' => false
        ];
        return $retour;
    }


}
