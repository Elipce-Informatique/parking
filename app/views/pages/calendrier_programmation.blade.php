@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/calendrier.css')}}">
@stop

@section('content')
    <div class="row" id="content_prog"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/calendrier_programmation.app.js')}}"></script>
@stop