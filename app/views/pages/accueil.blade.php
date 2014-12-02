@extends('layouts.accueil')

@section('css')
    {{--<link rel="stylesheet" href="{{URL::asset('')}}">--}}
@stop

@section('jumbotron')
    <h1>{{Lang::get('accueil.bienvenue_titre')}}</h1>
    <p>{{Lang::get('accueil.bienvenue_text')}}</p>
    <p><a class="btn btn-primary btn-lg" href="#" role="button">{{Lang::get('accueil.bouton_bleu')}} »</a></p>
@stop

@section('content')
    <div class="row" id="blocks_accueil">
        <div class="col-md-4 col-sm-6" id="block_admin">

        </div>
        <div class="col-md-4 col-sm-6">
          <h2>Métier 1</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a class="btn btn-default" href="#" role="button">View details »</a></p>
       </div>
        <div class="col-md-4 col-sm-6">
          <h2>Métier 2</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
          <p><a class="btn btn-default" href="#" role="button">View details »</a></p>
        </div>
    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('/public/js/accueil.app.js')}}"></script>
@stop