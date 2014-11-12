<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="public/css/_global.css">
        <link rel="stylesheet" href="public/css/lib/bootstrap.css">
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- Header de l'application -->
        <div id="header">@yield('header')</div>

        <!-- Contenu de l'application -->
        <div id="content">
            @yield('content')
        </div>

        <!-- Footer de l'application -->
        <div id="footer">
            @yield('footer')
        </div>


        <!-- Inclusion des differents scripts globaux -->
        <div id="scripts">
            <script src="public/js/bootstrap.js"></script>
            @yield('scripts')
        </div>


    </body>
</html>