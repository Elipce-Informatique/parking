@extends('layouts.default')

{{--@section('css')--}}
{{--<link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">--}}
{{--@stop--}}

@section('content')
    <div id="page_etats_d_occupation"></div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/etats_d_occupation.app.js')}}"></script>
@stop