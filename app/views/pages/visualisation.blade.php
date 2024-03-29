@extends('layouts.default')

@section('css')
    <link href="{{URL::asset('public/css/leaflet_plugins.css')}}" rel="stylesheet">
    <link href="{{URL::asset('public/css/parking.css')}}" rel="stylesheet">
@stop

@section('content')

    <div id="page_visualisation_parking" class="row full-height"></div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/libs/leaflet.min.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.plugins.js')}}"></script>
    <script src="{{URL::asset('public/js/visualisation.app.js')}}"></script>
@stop