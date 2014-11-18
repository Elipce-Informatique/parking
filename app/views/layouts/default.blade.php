@extends('...structure')

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

    <!-- Contenu de l'application -->
    <div class="container-fluid">
        <div class="row">
            <div id="menu-left" class="col-md-2">
                @yield('menu-left')
            </div>
            <div  id="content" class="col-md-10">
                @yield('content')
            </div>
        </div>
    </div>

    <!-- Footer de l'application -->
    <div id="footer">
        @yield('footer')
    </div>
@stop

@section('struct_scripts')
    @yield('scripts')
@stop
