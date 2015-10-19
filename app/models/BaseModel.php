<?php

class BaseModel extends Eloquent
{
    public static function boot()
    {
        parent::boot();

        static::creating(function($model)
        {
            if(Auth::check()) {
                $model->created_by = Auth::user()->id;
                $model->updated_by = Auth::user()->id;
            }
        });

        static::updating(function($model)
        {
            if(Auth::check())
            {
                $model->updated_by = Auth::user()->id;
            }
        });
    }

}

?>