@extends('layouts.default')

{{--@section('css')--}}
    {{--<link rel="stylesheet" href="{{URL::asset('public/css/utilisateur.css')}}">--}}
{{--@stop--}}

@section('content')
    <div id="page_profil" class="row"></div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/profil.app.js')}}"></script>
@stop