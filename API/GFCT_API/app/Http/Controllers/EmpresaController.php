<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Rules\CifRule;
use Illuminate\Support\Facades\Validator;

class EmpresaController extends Controller
{
    protected $user;
    public function __construct(Request $request)
    {
        $token = $request->header('Authorization');
        if ($token != '') {
            // En caso de que requiera autentificación la ruta obtenemos el usuario y lo almacenamos en una variable
            $this->user = JWTAuth::parseToken()->authenticate();
        }
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if ($this->user->rol == "docente") {
            //  Listamos todos los Artículos
            $empresas = Empresa::all();

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $empresas
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        if ($this->user->rol == "docente") {
            // Indicamos que solo queremos recibir nombre, Cif y num_empleado de la request
            $data = $request->only('nombre', 'cif', 'num_empleado');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'nombre' => 'required|string|max:15',
                'cif' => ["required", "string", "size:9", new CifRule, "unique:empresas,cif"],
                'num_empleado' => 'required|numeric|min:0|max:999999'
            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails()) {
                return response()->json(['error' => $validator->messages()], 400);
            }

            // Creamos la nueva empresa si todo es correcto
            $empresa = Empresa::create([
                'nombre' => $request->nombre,
                'cif' => $request->cif,
                'num_empleado' => $request->num_empleado,
            ]);

            // Devolvemos la respuesta con los datos del empresa
            return response()->json([
                'exito' => true,
                'mensaje' => 'Empresa creada correctamente',
                'data' => $empresa
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        if ($this->user->rol == "docente") {
            $empresa = Empresa::find($id);

            // Si la empresa no existe devolvemos error no encontrado
            if (!$empresa) {
                return response()->json([
                    'mensaje' => 'empresa no encontrada.'
                ], 404);
            } else {
                // Buscamos datos de las sedes
                $datosSedes = Empresa::find($id)->sedes;
                //asignamos los datos a la empresa
                $empresa->sedes = $datosSedes;

                // Devolvemos la respuesta
                return response()->json([
                    'data' => $empresa
                ], Response::HTTP_OK);
            }
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        if ($this->user->rol == "docente") {
            $empresa = Empresa::find($id);

            // Si la empresa no existe devolvemos error no encontrado
            if (!$empresa) {
                return response()->json([
                    'mensaje' => 'empresa no encontrada.'
                ], 404);
            } else {
                // Indicamos que solo queremos recibir nombre, cif y num_empleado de la request
                $data = $request->only('nombre', 'cif', 'num_empleado');

                $validaciones = [
                    'nombre' => 'required|string|max:15',
                    'num_empleado' => 'required|numeric|min:0|max:999999'
                ];

                if ($empresa->cif != $data["cif"]) {
                    $validaciones["cif"] = ["required", "string", "size:9", new CifRule, "unique:empresas,cif"];
                }

                //Realizamos las validaciones
                $validator = Validator::make($data, $validaciones);

                // Devolvemos un error si fallan las validaciones
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->messages()], 400);
                }

                // actualizamos la nueva empresa si todo es correcto
                $empresa->update([
                    'nombre' =>  $request->nombre,
                    'cif' =>  $request->cif,
                    'num_empleado' =>  $request->num_empleado,
                ]);

                // Devolvemos la respuesta con los datos del empresa
                return response()->json([
                    'exito' => true,
                    'mensaje' => 'empresa actualizada correctamente',
                    'data' => $empresa
                ], Response::HTTP_OK);
            }
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        if ($this->user->rol == "docente") {
            // Buscamos la empresa 
            $empresa = Empresa::find($id);

            // Si la empresa no existe devolvemos error no encontrado
            if (!$empresa) {
                return response()->json([
                    'mensaje' => 'empresa no encontrado.'
                ], 404);
            }
            //Buscamos si la empresa tiene candidaturas asociados
            $sedesEmpresa = Empresa::find($id)->sedes;
            $candidaturasEmpresa = Empresa::find($id)->candidaturas;

            //Si la empresa tiene candidaturas no se puede borrar
            if (count($candidaturasEmpresa) > 0) {
                return response()->json([
                    'mensaje' => 'No se puede borrar la empresa por tener candidaturas asociadas.'
                ], 404);
            } elseif (count($sedesEmpresa) > 0) {
                return response()->json([
                    'mensaje' => 'No se puede borrar la empresa por tener sedes asociadas.'
                ], 404);
            } else {
                // Eliminamos la empresa
                $empresa->delete();

                // Devolvemos la respuesta
                return response()->json([
                    'mensaje' => 'empresa borrada correctamente'
                ], Response::HTTP_OK);
            }
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }
}
