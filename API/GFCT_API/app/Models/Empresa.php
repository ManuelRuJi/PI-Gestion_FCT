<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre', 
        'cif', 
        'num_empleado'
    ];

    public function candidaturas()
    {
        return $this->hasMany('App\Models\Candidatura', 'empresa_id');
    }

    public function sedes()
    {
        return $this->hasMany('App\Models\Sede', 'empresa_id');
    }

}
