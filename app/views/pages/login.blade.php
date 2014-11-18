@extends('...layouts.login')

@section('css')
    <link rel="stylesheet" type="text/css" href="{{URL::asset('public/css/login.css')}}">
@stop

@section('content')
    {{ Form::open(['route'=>'sessions.store', 'class'=>'form-signin']) }}

        <h2>{{Lang::get('login.title_bienvenue')}}</h2>

            {{Form::email('email', '', ['class'=>'form-control', 'placeholder'=>Lang::get('global.email')])}}

            {{Form::password('password', ['class'=>'form-control', 'placeholder'=>Lang::get('global.password')])}}

        <div class="checkbox">
            <label>
                {{Form::checkbox('remember-me')}} {{Lang::get('login.login')}}
            </label>
        </div>

        {{Form::submit('login', ['class'=>'btn btn-lg btn-primary btn-block'])}}
    {{ Form::close() }}
@stop

@section('scripts')

@stop