@include('js-localization::head')
<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('page_title')</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" href="favicon.ico"/>

    <!-- CSS GLOBAL À L'APPLICATION -->
    <link rel="stylesheet" type="text/css" href="{{URL::asset('/public/css/_global.css')}}">
    <link rel="stylesheet" type="text/css" href="{{URL::asset('/public/css/libs/all.css')}}">
    @yield('struct_css')
</head>
<body>

@yield('struct_content')

        <!-- Inclusion des differents scripts globaux -->
        <div id="scripts">
            @yield('js-localization.head')
            @include('auth_js')
            <script type="text/javascript">
                window.BASE_URI="{{URL::asset('/')}}"
                window.modeDev="{{ getenv("PRODUCTION")===false || getenv("PRODUCTION")=='false'  }}"
            </script>
            <script type="text/javascript" src="{{URL::asset('/public/js/global/vendor.js')}}"></script>
            <script type="text/javascript" src="{{URL::asset('/public/js/global/app.js')}}"></script>
            <script type="text/javascript" src="{{URL::asset('/public/js/libs/bundled_libs.js')}}"></script>
            @yield('struct_scripts')
        </div>
        @include('notifications')
        <input type="hidden" id="_token" name="_token" value="{{csrf_token()}}">
    </body>
</html>
