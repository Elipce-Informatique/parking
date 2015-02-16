@extends('...structure')

@section('struct_css')
    @yield('css')
@stop

@section('struct_content')
    {{-- ICI ON EST JUSTE APRÈS LE <body> --}}

    <!--[if lt IE 8]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a
            href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Menu left de l'application -->
    <div id="menu-left" class="navmenu navmenu-default navmenu-fixed-left offcanvas">
    </div>
    <!-- Menu header de l'application -->
    <nav id="menu-top" class="navbar navbar-inverse navbar-fixed-top" role="navigation"></nav>

    <!-- Contenu de l'application -->
    <div class="container-fluid">
        <div class="row full-height">
            <div id="content" class="col-sm-12 col-md-12 main full-height">
                @yield('content')
            </div>
        </div>
    </div>
@stop

@section('struct_scripts')
    <script type="text/javascript" src="{{URL::asset('/public/js/global/menu.app.js')}}"></script>
    @yield('scripts')
@stop
