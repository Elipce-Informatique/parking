@extends('layouts.default')

@section('content')
    <div class="row" id="jumbo">
        <div class="jumbotron">
           <div class="container">
               <h1>{{Lang::get('administration.titre')}}</h1>
               <p>{{Lang::get('administration.text')}}</p>
           </div>
       </div>
    </div>

    <div class="row" id="blocks_admin">
        <div class="col-md-offset-2 col-md-4 col-sm-6" id="block_utilisateur"></div>
        <div class="col-md-4 col-sm-6" id="block_profil"></div>

    </div>
@stop

@section('scripts')
    <script src="{{URL::asset('public/js/administration.app.js')}}"></script>
@stop