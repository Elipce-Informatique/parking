@extends('layouts.login')

@section('content')
    <div class="row">
        <div class="col-md-offset-3 col-md-6">
            <h1>{{Lang::get('reminders.reset_titre')}}</h1>
            {{Form::open()}}

                <div class="form-group">
                    {{Form::label('email', Lang::get('global.email').' : ')}}
                    {{Form::email('email', '', ['class'=>'form-control', 'placeholder'=>Lang::get('global.email'), 'required'])}}
                </div>

                <div class="form-group">
                    {{Form::submit(Lang::get('reminders.reset_button'), ['class'=>'btn btn-danger form-control'])}}
                </div>

            {{Form::close()}}
        </div>
    </div>
@stop