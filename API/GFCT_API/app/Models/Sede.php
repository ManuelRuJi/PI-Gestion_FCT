<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{

    protected $table = 'sedes';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'direccion',
        'telefono',
        'empresa_id'
    ];

    public function empresa()
    {
        return $this->belongsTo('App\Models\Empresa', 'empresa_id');
    }

}
