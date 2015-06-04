@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/parking.css')}}">
@stop

@section('content')
    <div class="row" id="content_parking"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/parking.app.js')}}"></script>
@stop