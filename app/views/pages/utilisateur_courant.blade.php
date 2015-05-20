@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">
@stop

@section('content')
    <div class="row" id="content_user"/>
    <input type="hidden" value="{{{$user}}}" name="user_data" id="user_data"/>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/utilisateur_courant.app.js')}}"></script>
@stop