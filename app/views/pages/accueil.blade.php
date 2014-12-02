@extends('layouts.accueil')

@section('css')
    {{--<link rel="stylesheet" href="{{URL::asset('')}}">--}}
@stop

@section('jumbotron')
    <h1>{{Lang::get('accueil.bienvenue_titre')}}</h1>
    <p>{{Lang::get('accueil.bienvenue_text')}}</p>
    <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more »</a></p>
@stop

@section('content')
    <div class="row">
        <div class="col-md-4">
          <h2>{{Lang::get('menu.top.administration')}}</h2>
          <p>Section d'administration de l'application. Ici les administrateurs peuvent gérer les utilisateurs, les profils, les droits d'accès aux différents modules.</p>
          <p><a class="btn btn-default" href="#" role="button">View details »</a></p>
        </div>
        <div class="col-md-4">
          <h2>Section 2</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a class="btn btn-default" href="#" role="button">View details »</a></p>
       </div>
        <div class="col-md-4">
          <h2>Section 3</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
          <p><a class="btn btn-default" href="#" role="button">View details »</a></p>
        </div>
    </div>
@stop

@section('scripts')
    {{--<script src="{{URL::asset('')}}"></script>--}}
@stop