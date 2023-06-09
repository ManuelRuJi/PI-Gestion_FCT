<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidatura extends Model
{
    protected $table = 'candidaturas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'alumno_id', 
        'empresa_id'
    ];

    public function alumno()
    {
        return $this->belongsTo('App\Models\Alumno', 'alumno_id');
    }

    public function empresa()
    {
        return $this->belongsTo('App\Models\Empresa', 'empresa_id');
    }

}
