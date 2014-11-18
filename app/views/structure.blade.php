@include('js-localization::head')
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <!-- CSS GLOBAL À L'APPLICATION -->
        <link rel="stylesheet" href="{{URL::asset('/public/css/_global.css')}}">
        <link rel="stylesheet" href="{{URL::asset('/public/css/lib/bootstrap.css')}}">
        <link rel="stylesheet" href="{{URL::asset('/public/css/lib/bootstrap-theme.css')}}">
        @yield('struct_css')
    </head>
    <body>

        @yield('struct_content')

        <!-- Inclusion des differents scripts globaux -->
        <div id="scripts">
            @yield('js-localization.head')
            <script>window.BASE_URI="{{URL::asset('/')}}"</script>
            <script src="{{URL::asset('/public/js/global/app.js')}}"></script>
            <script src="{{URL::asset('/public/js/libs/bootstrap.js')}}"></script>
            @yield('struct_scripts')
        </div>
        <input type="hidden" id="_token" name="_token" value="{{csrf_token()}} ?>">
    </body>
</html>