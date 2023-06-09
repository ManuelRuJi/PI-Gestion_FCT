<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Sede;
use Illuminate\Support\Facades\Validator;

class SedeController extends Controller
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
            $sedes = Sede::all();

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $sedes
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
            // Indicamos que solo queremos recibir nombre, direccion, telefono y empresa_id de la request
            $data = $request->only('nombre', 'direccion', 'telefono', 'empresa_id');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'nombre' => 'required|string|max:15',
                'direccion' => 'required|string|max:150',
                'telefono' => 'required|numeric|min:100000000|max:999999999|unique:sedes,telefono',
                'empresa_id' => 'exists:empresas,id',
            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails()) {
                return response()->json(['error' => $validator->messages()], 400);
            }

            // Creamos la nueva sede si todo es correcto
            $sede = Sede::create([
                'nombre' =>  $request->nombre,
                'direccion' =>  $request->direccion,
                'telefono' =>  $request->telefono,
                'empresa_id' =>  $request->empresa_id,
            ]);

            // Devolvemos la respuesta con los datos de la sed
            return response()->json([
                'exito' => true,
                'mensaje' => 'Sede creada correctamente',
                'data' => $sede
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
            $sede = Sede::find($id);

            // Si la sede no existe devolvemos error no encontrado
            if (!$sede) {
                return response()->json([
                    'mensaje' => 'sede no encontrada.'
                ], 404);
            } else {
                // Buscamos datos de la empresa
                $datosempresa = Sede::find($id)->empresa;
                //asignamos los datos a la sede
                $sede->empresa = $datosempresa;

                // Devolvemos la respuesta
                return response()->json([
                    'data' => $sede
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
            $sede = Sede::find($id);

            // Si la sede no existe devolvemos error no encontrado
            if (!$sede) {
                return response()->json([
                    'mensaje' => 'sede no encontrada.'
                ], 404);
            } else {
                // Indicamos que solo queremos recibir nombre, direccion y telefono de la request
                $data = $request->only('nombre', 'direccion', 'telefono');

                $validaciones = [
                    'nombre' => 'required|string|max:15',
                    'direccion' => 'required|string|max:150',
                ];
                if ($sede->telefono != $data["telefono"]) {
                    $validaciones["telefono"] = 'required|numeric|min:100000000|max:999999999|unique:users,telefono';
                }

                //Realizamos las validaciones
                $validator = Validator::make($data,$validaciones);


                // Devolvemos un error si fallan las validaciones
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->messages()], 400);
                }

                // actualizamos la nueva sede si todo es correcto
                $sede->update([
                    'nombre' =>  $request->nombre,
                    'direccion' =>  $request->direccion,
                    'telefono' =>  $request->telefono,
                ]);

                // Devolvemos la respuesta con los datos del sede
                return response()->json([
                    'exito' => true,
                    'mensaje' => 'Sede actualizada correctamente',
                    'data' => $sede
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
            $sede = Sede::find($id);

            // Si la sede no existe devolvemos error no encontrado
            if (!$sede) {
                return response()->json([
                    'mensaje' => 'sede no encontrada.'
                ], 404);
            } else {
                // Eliminamos la sede
                $sede->delete();

                // Devolvemos la respuesta
                return response()->json([
                    'mensaje' => 'sede borrada correctamente'
                ], Response::HTTP_OK);
            }
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }
}
