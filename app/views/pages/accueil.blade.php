@extends('layouts.accueil')

@section('css')
    {{--<link rel="stylesheet" href="{{URL::asset('')}}">--}}
@stop

@section('jumbotron')
    <h1>{{Lang::get('accueil.bienvenue_titre')}}</h1>
    <p>{{Lang::get('accueil.bienvenue_text')}}</p>
@stop

@section('content')
    <div class="row" id="blocks_accueil">
        @foreach($url as $key=>$css)
            <div class="col-md-3 {{$css}}" id="{{'block_'.$key}}" ></div>
        @endforeach
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('/public/js/accueil.app.js')}}"></script>
@stop