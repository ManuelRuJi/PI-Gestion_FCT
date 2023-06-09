<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use JWTAuth;
use App\Models\User;
use App\Rules\DniRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
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
    // Función que utilizaremos para registrar al usuario
    public function register(Request $request)
    {
        if ($this->user->rol=="docente") {
            // Indicamos que solo queremos recibir nombre, apellidos, edad,email y password de la request
            $data = $request->only('nombre', 'apellidos', 'edad', 'email', 'password', 'dni', 'telefono', 'rol');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'nombre' => 'required|string',
                'apellidos' => 'required|string',
                'edad' => 'required|numeric|min:10|max:100',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|max:50',
                'dni' => ["required","string","size:9", new DniRule,"unique:users,dni"],
                'telefono' => 'nullable|numeric|min:100000000|max:999999999|unique:users,telefono',
                'rol' => 'required|string|in:docente,alumno'
            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails())
            {
                return response()->json(['error' => $validator->messages()], 400);
            }

            // Creamos el nuevo usuario si todo es correcto
            $usuario = User::create([
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'edad' => $request->edad,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'dni' => $request->dni,
                'telefono' => $request->telefono,
                'rol' => $request-> rol
            ]);

            if ($request-> rol=="alumno") {

                Alumno::create([
                    'id' => $usuario->id,
                    'cv' => "",
                    'profesor_seguimiento_id' => $this->user->id
                ]);
                //buscamos al alumno para devolverlo
                $alumno=Alumno::find($usuario->id);
                
                // Devolvemos la respuesta con los datos del usuario
                return response()->json([
                    'exito' => true,
                    'mensaje' => 'Alumno creado correctamente',
                    'usuario' => $usuario,
                    'alumno'=>$alumno
                ], Response::HTTP_OK);
            }
            // Devolvemos la respuesta con los datos del usuario
            return response()->json([
                'exito' => true,
                'mensaje' => 'docente creado correctamente',
                'usuario' => $usuario
            ], Response::HTTP_OK);
        }else{
            return response()->json([
                'mensaje' => 'No tienes permiso para registrar usuarios'
            ], 401);
        }
    }

    // Funcion que utilizaremos para hacer login
    public function authenticate(Request $request)
    {
        // Indicamos que solo queremos recibir email y password de la request
        $credentials = $request->only('email', 'password');
        
        // Validaciones
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:6|max:50'
        ]);

        // Devolvemos un error de validación en caso de fallo en las verificaciones
        if ($validator->fails())
        {
            return response()->json(['error' => $validator->messages()], 400);
        }

        // Intentamos hacer login
        try 
        {
            if (!$token = JWTAuth::attempt($credentials)) {
                // Credenciales incorrectas.
                return response()->json([
                    'exito' => false,
                    'mensaje' => 'Login falló: credenciales incorrectas',
                ], 401);
            }
        } 
        catch (JWTException $e) 
        {
            // Error al intentar crear el token
            return response()->json([
                'exito' => false,
                'mensaje' => 'No se ha podido crear el token',
            ], 500);
        }

        // Devolvemos el token
        return response()->json([
            'exito' => true,
            'token' => $token
        ]);
    }

    // Función que utilizaremos para eliminar el token y desconectar al usuario
    public function logout(Request $request)
    {
        try 
        {
            // Si el token es válido eliminamos el token desconectando al usuario.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'exito' => true,
                    'mensaje' => 'Usuario desconectado'
                ]);
        } 
        catch (JWTException $exception) 
        {
            // Error al intentar invalidar el token
            return response()->json([
                    'exito' => false,
                    'mensaje' => 'Error al intentar desconectar al usuario'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } 
    }

    // Función que utilizaremos para obtener los datos del usuario.
    public function getUser(Request $request)
    {
        // Miramos si el usuario se puede autenticar con el token
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            return response()->json([
                'exito' => false,
                'mensaje' => 'Token invalido / token expirado',
            ], 401);
        }

        return response()->json([
            'exito' => true,
            'usuario' => $user
        ]);
    }

}
