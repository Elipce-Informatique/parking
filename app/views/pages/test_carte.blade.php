@extends('layouts.default')

@section('css')
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
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