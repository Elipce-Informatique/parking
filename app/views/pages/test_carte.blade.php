@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/leaflet_plugins.css')}}">
@stop

@section('content')
    <div id="page_test">
        <div id="map_test" style="height: 400px;width: 800px;"></div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/test_carte.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.min.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.plugins.js')}}"></script>

@stop