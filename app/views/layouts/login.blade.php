@extends('...structure')

@section('page_title')
    {{Lang::get('accueil.bienvenue_titre')}}
@stop

@section('struct_css')
    <link rel="stylesheet" type="text/css" href="{{URL::asset('public/css/login.css')}}">
    @yield('css')
@stop

@section('struct_content')
    <div class="container">
        @include('flash::message')
        @yield('content')
    </div>
@stop

@section('struct_scripts')
    @yield('scripts')
@stop