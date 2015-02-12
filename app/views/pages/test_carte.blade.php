@extends('layouts.default')

@section('css')
    <link href="{{URL::asset('public/css/leaflet_plugins.css')}}" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
@stop

@section('content')
    <div id="page_test" class="row">
        <div id="map_test" class="col-md-12"></div>

        {{--<span class="btn btn-primary" data-toggle="offcanvas" data-target="#test_offcanvas" data-canvas="body">toto</span>--}}
        {{--<div id="test_offcanvas" class="offcanvas">qsjk dsld sdfuio sdygqfio sdgyufoqisdgfql sdigfqjk gqsdjk qFO </div>--}}

    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/libs/leaflet.min.js')}}"></script>
    <script src="{{URL::asset('public/js/libs/leaflet.plugins.js')}}"></script>
    <script src="{{URL::asset('public/js/test_carte.app.js')}}"></script>
@stop