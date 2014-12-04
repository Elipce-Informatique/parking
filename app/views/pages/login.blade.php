@extends('...layouts.login')

@section('css')

@stop

@section('content')
    {{ Form::open(['route'=>'sessions.store', 'class'=>'form-signin']) }}

        <h2>{{Lang::get('global.title_bienvenue')}}</h2>

            {{Form::email('email', '', ['class'=>'form-control', 'placeholder'=>Lang::get('global.email')])}}

            {{Form::password('password', ['class'=>'form-control', 'placeholder'=>Lang::get('global.password')])}}

        <div class="checkbox">
            <label>
                {{Form::checkbox('remember-me')}} {{Lang::get('global.remember')}}
            </label>
        </div>

        {{Form::submit(Lang::get('global.login'), ['class'=>'btn btn-lg btn-primary btn-block'])}}
        {{ link_to('/password/remind', Lang::get('global.password_oublie')) }}
    {{ Form::close() }}
@stop
