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
        <div class="col-md-3" id="1"></div>
        <div class="col-md-3" id="2"></div>
        <div class="col-md-3" id="3"></div>
        <div class="col-md-3" id="4"></div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/administration_parking.app.js')}}"></script>
@stop