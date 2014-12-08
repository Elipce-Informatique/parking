@extends('layouts.default')

{{--@section('css')--}}
    {{--<link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">--}}
{{--@stop--}}

@section('content')
    <div class="row" id="bandeau">
    </div>

    <div class="row">
        <div class="col-md-12">
            <div id="tableau_profil_react">

            </div>
        </div>
    </div>
    <div id="tabModule" class="row">
        <div class="col-md-12 bandeau">
            <h1>{{ Lang::get('administration.profil.titre_module') }}</h1>
        </div>
        <div class="col-md-12">
            <div id="tableau_module_profil_react">

            </div>
        </div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/profil.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/jquery.dataTables.min.js')}}"></script>
@stop