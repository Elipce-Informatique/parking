@extends('layouts.default')

{{--@section('css')--}}
{{--<link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">--}}
{{--@stop--}}

@section('content')
    <div id="configuration_parking"></div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/configuration_parking.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/jquery.dataTables.min.js')}}"></script>
@stop