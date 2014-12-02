@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">
@stop

@section('content')
    <div class="row" id="bandeau">
    </div>

    <div class="row">
        <div class="col-md-12"> 
            <div id="tableau_react">

            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12"> 
            <button id="test" type="button">IIIIIIII</button>
        </div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/utilisateur.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/jquery.dataTables.min.js')}}"></script>
@stop