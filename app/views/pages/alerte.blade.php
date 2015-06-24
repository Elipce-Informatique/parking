@extends('layouts.default')

@section('css')
    <link href="{{URL::asset('public/css/leaflet_plugins.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="{{URL::asset('public/css/parking.css')}}">
@stop

@section('content')
    <div class="row" id="content_alerte"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/libs/leaflet.min.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.plugins.js')}}"></script>
    <script src="{{URL::asset('public/js/alerte.app.js')}}"></script>
@stop