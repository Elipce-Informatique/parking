@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/parking.css')}}">
@stop

@section('content')
    <div class="row" id="content_niveau"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/niveau.app.js')}}"></script>
@stop