@extends('layouts.default')

@section('css')
    <link rel="stylesheet" href="public/css/utilisateur.css">
@stop

@section('content')
    <div class="row">
        <div class="col-md-12"> 
            <h1>Gestion des utilisateurs de l'application</h1>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12"> 
            @if($users->count())
            <select>
                @foreach($users as $user)
                    <option>{{$user->nom}}</option>
                @endforeach
            </select>  
            @else
                {{"Pas d'utilisateurs"}}
            @endif
        </div>
    </div>

    <div class="row">
        <div class="col-md-12"> 
            <div id="tableau_react">

            </div>
        </div>
    </div>
<!--    {{ Form::open(['route'=>'sessions.store']) }}
        <div>
            {{Form::label('email', 'Email: ')}}
            {{Form::text('email')}}
        </div>
        <div>
            {{Form::label('password', 'Mot de passe: ')}}
            {{Form::password('password')}}
        </div>

        <div>
            {{Form::submit('login')}}
        </div>
    {{ Form::close() }}-->
@stop

@section('scripts')
    <script src="public/js/utilisateur.app.js"></script>
@stop