@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">
@stop

@section('content')
    <div class="row" id="content_user"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/utilisateur.app.js')}}"></script>
@stop