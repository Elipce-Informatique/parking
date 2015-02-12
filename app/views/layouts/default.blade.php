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
            <div id="menu-left" class="col-sm-3 col-md-2 sidebar">
            </div>
            <div  id="content" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                @yield('content')
            </div>
        </div>
    </div>
@stop

@section('struct_scripts')
    <script type="text/javascript" src="{{URL::asset('/public/js/global/menu.app.js')}}"></script>
    @yield('scripts')
@stop
