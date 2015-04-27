<?php

class ConfigurationParkingController extends \BaseController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return View::make('pages.configuration_parking');
    }

    /**
     * Génère les données à donner à manger au treeview
     * [
     *      {
     *      text: 'Parking Beauvais',
     *      id: '1',
     *      nodes: [
     *           {
     *               text: 'Niveau 1',
     *               id: '11'
     *           },
     *           {
     *               text: 'Niveau 2',
     *               id: '12'
     *
     *           },
     *           {
     *               text: 'Niveau 3',
     *               id: '12',
     *                  nodes: [
     *                          {
     *                              text: 'Niveau 1',
     *                              id: '11'
     *                          }
     *                      ]
     *           }
     *           ]
     *      },
     *      {...}
     * ]
     */
    public function menuTreeView()
    {

    }

    /**
     * TODO : retourner toutes les données dont on a besoin
     * @param $id
     */
    public function parkingInfos($id)
    {
        return Parking::find($id);
    }


}
