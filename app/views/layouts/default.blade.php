<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>CRM</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <!-- CSS GLOBAL À L'APPLICATION -->
        <link rel="stylesheet" href="public/css/_global.css">
        <link rel="stylesheet" href="public/css/lib/bootstrap.css">
        <link rel="stylesheet" href="public/css/lib/bootstrap-theme.css">
        @yield('css')
    </head>
    <body>
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


        <!-- Inclusion des differents scripts globaux -->
        <div id="scripts">
            <script src="public/js/global/app.js"></script>
            <script src="public/js/libs/bootstrap.js"></script>
            @yield('scripts')
        </div>


    </body>
</html>