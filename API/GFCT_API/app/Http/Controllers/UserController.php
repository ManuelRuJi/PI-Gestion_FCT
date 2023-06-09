<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\User;
use App\Rules\DniRule;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $user;
    public function __construct(Request $request)
    {
        $token = $request->header('Authorization');
        if($token != '')
        {
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
        if ($this->user->rol=="docente") {
            //  Listamos todos los usuarios si eres docente
            $Usuarios = User::orderBy("rol","desc")->get();

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $Usuarios
            ], Response::HTTP_OK);
        }else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function ListaProfesores()
    {
        if ($this->user->rol=="docente") {
            //  Listamos todos los usuarios si eres docente
            $Usuarios = User::where("rol","docente")->get();

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $Usuarios
            ], Response::HTTP_OK);
        }else {
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
        if ($this->user->rol=="docente" || $this->user->id == $id) {
            // Buscamos el usuario 
            $usuario = User::find($id);
        
            // Si el usuario no existe devolvemos error no encontrado
            if (!$usuario)
            {
                return response()->json([
                    'mensaje' => 'usuario no encontrado.'
                ], 404);
            }elseif ($usuario->rol=="alumno"){
                // incluimos sus datos si es un alumno
                $datosAlumno = User::find($id)->alumno;
                $Profesor=User::find($id)->alumno->profesor;
                $usuario->alumno = $datosAlumno;
                $usuario->alumno->profesor = $Profesor->nombre." ".$Profesor->apellidos;
                $usuario->alumno->emailProfesor = $Profesor->email;
            }
            // Devolvemos el usuario
            return response()->json([
                'data' => $usuario
            ], Response::HTTP_OK);
        }else {
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
        if ($this->user->rol=="docente" || $this->user->id==$id) {
            // Buscamos el usuario
            $usuario = User::find($id);
            // Si no tenemos usuario mandado el mensaje correspondiente
            if (!$usuario)
            {
                return response()->json([
                    'mensaje' => 'usuario no encontrado.'
                ], 404);
            }

            // Indicamos que solo queremos recibir nombre, apellidos, edad,email y password de la request
            $data = $request->only('nombre', 'apellidos', 'edad', 'email', 'dni', 'telefono');
            // indicamos la validaciones que realizaremos
            $validaciones= [
                'nombre' => 'required|string',
                'apellidos' => 'required|string',
                'edad' => 'required|numeric|min:10|max:100',
            ];
            //añadimos la validacion de los siguientes campos solo si es diferente a la actual
            if ($usuario->email!=$data["email"]) {
                $validaciones["email"] = 'required|email|unique:users,email';
            }
            if ($usuario->dni!=$data["dni"]) {
                $validaciones["dni"] = ["required","string","size:9", new DniRule,"unique:users,dni"];
            }
            if ($usuario->telefono!=$data["telefono"]) {
                $validaciones["telefono"] = 'nullable|numeric|min:100000000|max:999999999|unique:users,telefono';
            }

            //Realizamos las validaciones
            $validator = Validator::make($data,$validaciones);

            //Si falla la validación error devolvemos los errores.
            if ($validator->fails())
            {
                return response()->json(['error' => $validator->messages()], 400);
            }

            // Actualizamos el usuario.
            $usuario->update([
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'edad' => $request->edad,
                'email' => $request->email,
                'dni' => $request->dni,
                'telefono' => $request->telefono
            ]);

            //Devolvemos los datos actualizados.
            return response()->json([
                'mensaje' => 'Usuario actualizada correctamente',
                'data' => $usuario
            ], Response::HTTP_OK);
            
        }else {
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
        if ($this->user->rol=="docente") {
            // Buscamos el usuario 
            $usuario = User::find($id);


            // Si el usuario no existe devolvemos error no encontrado
            if (!$usuario)
            {
                return response()->json([
                    'mensaje' => 'usuario no encontrado.'
                ], 404);
            }
            elseif ($usuario->id==$this->user->id) {
                return response()->json([
                    'mensaje' => 'No puedes borrar tu usuario'
                ], 401);
            }
            elseif (Alumno::find($id)) 
            {
                return response()->json([
                    'mensaje' => 'Los alumnos se deben eliminar desde su controller'
                ], 400);
            }
            else{
                $alumnos=User::find($id)->profesor;

                if (!$alumnos) {
                    // Eliminamos el usuario
                    $usuario->delete();
                    // Devolvemos la respuesta
                    return response()->json([
                        'mensaje' => 'usuario borrado correctamente'
                    ], Response::HTTP_OK);
                }else{
                    return response()->json([
                        'mensaje' => 'No puedes borrar un profesor que realiza seguimiento'
                    ], 400);
                }
                
            }
        }else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }
}
