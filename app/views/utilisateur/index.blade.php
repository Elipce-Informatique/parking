@extends('layouts.default')

@section('css')
<link rel="stylesheet" href="public/css/_global.css">
@stop

@section('content')
    <h1>Gestion des utilisateurs de l'application</h1>
    
        @if($users->count())
        <select>
            @foreach($users as $user)
                <option>{{$user->nom}}</option>
            @endforeach
        </select>  
        @else
            {{"Pas d'utilisateurs"}}
        @endif
        <div>
            
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