<?php

class TestController extends \BaseController
{

    /**
     * @return Response
     */
    public function index()
    {
        /*
         * SELECT m.* FROM utilisateurs u
            JOIN profil_utilisateur pu ON pu.utilisateur_id=u.id
            JOIN profils p ON p.id=pu.profil_id
            JOIN profil_module pm ON pm.profil_id=p.id
            JOIN modules m ON m.id=pm.module_id
            JOIN module_module mm ON mm.fils_id=m.id

            WHERE u.id=1 and mm.parent_id IS NULL

            GROUP BY m.id
         */
        // Récupérer les profils de l'utilisateur
        // Récupérer les modules de ces profils

        $modules = [];
        $modules = Auth::user()
            ->join('profil_utilisateur', 'profil_utilisateur.utilisateur_id', '=', 'utilisateurs.id')
            ->join('profils', 'profils.id', '=', 'profil_utilisateur.profil_id')
            ->join('profil_module', 'profil_module.profil_id', '=', 'profils.id')
            ->join('modules', 'modules.id', '=', 'profil_module.module_id')
            ->join('module_module', 'module_module.fils_id', '=', 'modules.id')
            ->where('utilisateurs.id', Auth::user()->id)
            ->whereNull('module_module.parent_id')
            ->groupBy('modules.id')
            ->get(['modules.*']);


//        $modules = Auth::user()->profils()->has('modules')->with('modules')->get();
//        $modules = Profil::with(array('modules'))->whereHas('utilisateurs', function($q){
//            $q->where('utilisateurs.id', Auth::user()->id);
//        })->whereHas('modules', function($q){
//            $q->where('modules.id', 1);
//        })->get();
        //dd($modules);
        return $modules;
    }
}
