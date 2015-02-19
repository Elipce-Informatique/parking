@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/calendrier.css')}}">
@stop

@section('content')
    <div class="row" id="content_jours"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/calendrier_jours.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/jquery.dataTables.min.js')}}"></script>
@stop