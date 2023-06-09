<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    protected $table = 'alumnos';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'cv', 
        'profesor_seguimiento_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'id');
    }

    public function candidaturas()
    {
        return $this->hasMany('App\Models\Candidatura', 'alumno_id');
    }

    public function profesor()
    {
        return $this->belongsTo('App\Models\User', 'profesor_seguimiento_id');
    }
}
