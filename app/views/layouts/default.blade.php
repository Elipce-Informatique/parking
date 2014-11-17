@extends('...structure')

@section('struct_css')
    @yield('css')
@stop

@section('struct_content')
    <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
    <!-- Header de l'application -->
    <div id="header">@yield('header')</div>

    <!-- Contenu de l'application -->
    <div class="container-fluid">
        <div class="row">
            <div id="menu" class="col-md-2">
                @yield('menu')
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

@section('struct_script')
    @yield('scripts')
@stop
