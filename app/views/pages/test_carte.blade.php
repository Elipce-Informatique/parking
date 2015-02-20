@extends('layouts.default')

@section('css')
    <link href="{{URL::asset('public/css/leaflet_plugins.css')}}" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
@stop

@section('content')
    <div id="row_tremps_reel" class="row" style="height:20%">
        <div id="zone_temps_reel" class="col-md-12">

        </div>
    </div>

    <div id="page_test" class="row" style="height:80%">
        <div id="map_test" class="col-md-12 full-height"></div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/libs/leaflet.min.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.plugins.js')}}"></script>
    <script src="{{URL::asset('public/js/test_carte.app.js')}}"></script>
@stop