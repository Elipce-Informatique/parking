@extends('layouts.default')

@section('content')
    <h1>Bienvenue, sur l'application !</h1>
    {{ Form::open(['route'=>'session.store']) }}
        <div>
            {{Form::label('login', 'Login : ')}}
            {{Form::text('login')}}
        </div>
        <div>
            {{Form::label('password', 'Mot de passe : ')}}
            {{Form::password('password')}}
        </div>

        <div>
            {{Form::submit('login')}}
        </div>
    {{ Form::close() }}
@stop