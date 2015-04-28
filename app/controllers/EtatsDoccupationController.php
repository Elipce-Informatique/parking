<?php

class EtatsDoccupationController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.etats_d_occupation');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        // Valeurs postées
        $fields = Input::except('_token');

        return json_encode(EtatsDoccupation::createNew($fields));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        // Champs du formualaire
        $fields = Input::except(['_token','_method']);
        return json_encode(EtatsDoccupation::updateEtatDoccupation($id, $fields));
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        // Infos état d'occupataion
        $infos = EtatsDoccupation::getInfosEtatById($id);
        // Combo type place
        $infos['dataTypesPlace'] = TypePlace::all();
        return $infos;
    }

    public function all()
    {
        $all = EtatsDoccupation::getAll();
        foreach($all as &$etat){
            $etat->etat_place = $etat->etat_place == 1 ? Lang::get('global.occupee') : Lang::get('global.libre');
        }
        return json_encode($all);
    }

    public function getLibelleExist($libelle)
    {
        return json_encode(EtatsDoccupation::getLibelleExist($libelle));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        return json_encode(EtatsDoccupation::deleteEtatDoccupation($id));
    }


}
