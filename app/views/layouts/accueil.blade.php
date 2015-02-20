@extends('...structure')
@section('page_title')
    {{Lang::get('accueil.bienvenue_titre')}}
@stop
@section('struct_css')
    @yield('css')
@stop

@section('struct_content')
    <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <!-- Menu header de l'application -->
    <nav id="menu-top" class="navbar navbar-inverse navbar-fixed-top" role="navigation">

    </nav>
    <div class="jumbotron">
        <div class="container">
            @yield('jumbotron')
        </div>
    </div>
    <!-- Contenu de l'application -->
    <div class="container">
        @yield('content')
    </div>
@stop

@section('struct_scripts')
    @yield('scripts')
    <script type="text/javascript" src="{{URL::asset('/public/js/global/menu.app.js')}}"></script>
@stop
