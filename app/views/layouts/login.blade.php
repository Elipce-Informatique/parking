@extends('...structure')

@section('struct_css')
    @yield('css')
@stop

@section('struct_content')
    <div class="container">
        @yield('content')
    </div>
@stop

@section('struct_scripts')
    @yield('scripts')
@stop