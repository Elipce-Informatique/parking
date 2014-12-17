@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">
@stop

@section('content')
    <div class="row" id="bandeau">
    </div>

    <div class="row">
        <div class="col-md-12" id="content_user">

        </div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/utilisateur.app.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/jquery.dataTables.min.js')}}"></script>
@stop