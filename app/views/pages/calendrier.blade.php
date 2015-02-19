@extends('layouts.default')

@section('content')
    <div class="row" id="jumbo">
        <div class="jumbotron">
            <div class="container">
                <h1>{{Lang::get('menu.side.calendrier')}}</h1>
                <p>{{Lang::get('administration_parking.calendrier.texte')}}</p>
            </div>
        </div>
    </div>

    <div class="row" id="blocks_calendrier">
        <div class="col-md-offset-2 col-md-4" id="block_jours_predef"></div>
        <div class="col-md-6" id="block_prog_horaire"></div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/calendrier.app.js')}}"></script>
@stop