@extends('layouts.default')

@section('content')
    <div class="row" id="jumbo">
        <div class="jumbotron">
            <div class="container">
                <h1>{{Lang::get('menu.top.administration_parking')}}</h1>

                <p>{{Lang::get('administration_parking.accueil.texte')}}</p>
            </div>
        </div>
    </div>

    <div class="row" id="blocks_admin">
        <div class="col-md-4 col-md-offset-2" id="block_etats_d_occupation"></div>
        <div class="col-md-4" id="block_configuration_parking"></div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/administration_parking.app.js')}}"></script>
@stop