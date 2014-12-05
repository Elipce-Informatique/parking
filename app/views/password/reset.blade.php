@extends('layouts.login')

@section('content')
    <div class="row">
        <div class="col-md-offset-3 col-md-6">
            <h1>{{Lang::get('reminders.new_password_titre')}}</h1>
            {{Form::open()}}

                {{Form::hidden('token', $token)}}

                <div class="form-group">
                    {{Form::label('email', Lang::get('global.email').' : ')}}
                    {{Form::email('email', '', ['class'=>'form-control', 'placeholder'=>Lang::get('global.email'), 'required'])}}
                </div>

                <div class="form-group">
                    {{Form::label('password', Lang::get('global.password').' : ')}}
                    {{Form::password('password', ['class'=>'form-control', 'placeholder'=>Lang::get('global.password'), 'required'])}}
                </div>

                <div class="form-group">
                    {{Form::label('password_confirmation', Lang::get('global.password').' : ')}}
                    {{Form::password('password_confirmation', ['class'=>'form-control', 'placeholder'=>Lang::get('global.password'), 'required'])}}
                </div>


                <div class="form-group">
                    {{Form::submit(Lang::get('reminders.modif_button'), ['class'=>'btn btn-success form-control'])}}
                </div>

            {{Form::close()}}
        </div>
    </div>
@stop