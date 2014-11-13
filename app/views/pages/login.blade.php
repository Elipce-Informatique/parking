@extends('...layouts.default')

@section('content')
    <h1>Bienvenue, sur l'application !</h1>
    {{ Form::open(['route'=>'sessions.store']) }}
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
    {{ Form::close() }}
@stop