@extends('layouts.default')

@section('content')
    <div class="row" id="jumbo">
        <div class="jumbotron">
            <div class="container">
                <h1>{{Lang::get('supervision.accueil.titre')}}</h1>

                <p>{{Lang::get('supervision.accueil.text')}}</p>
            </div>
        </div>
    </div>

    <div class="row" id="blocks_admin">
        <div class="col-md-offset-2 col-md-4 col-sm-6" id="block_visualisation"></div>
        <div class="col-md-4 col-sm-6" id="block_alertes"></div>

    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/supervision.app.js')}}"></script>
@stop