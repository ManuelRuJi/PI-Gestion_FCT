<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\Candidatura;
use Illuminate\Support\Facades\Validator;

class CandidaturaController extends Controller
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
            //  Listamos todos los Artículos
            $candidaturas = Candidatura::all();

            foreach ($candidaturas as $candidatura) {
                $nombreAlumno = $candidatura->alumno->user->nombre ." ". $candidatura->alumno->user->apellidos;
                $nombreEmpresa = $candidatura->empresa->nombre;

                $candidatura->nombreAlumno= $nombreAlumno;
                $candidatura->nombreEmpresa= $nombreEmpresa;

                // Ocultar completamente los objetos "alumno" y "empresa"
                $candidatura->makeHidden(['alumno', 'empresa']);
            }

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $candidaturas
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
    public function listaCandidaturaAlumno($id)
    {
        //
        if ($this->user->rol=="docente" || $this->user->id==$id) {

            $alumno = Alumno::find($id);

            // Si el Alumno no existe devolvemos error no encontrado
            if (!$alumno)
            {
                return response()->json([
                    'mensaje' => 'alumno no encontrada.'
                ], 404);
            }
            
            //  Listamos todos los Artículos
            $candidaturas =Candidatura::where("alumno_id", $alumno->id)->get();

            foreach ($candidaturas as $candidatura) {
                $nombreAlumno = $candidatura->alumno->user->nombre ." ". $candidatura->alumno->user->apellidos;
                $nombreEmpresa = $candidatura->empresa->nombre;

                $candidatura->nombreAlumno= $nombreAlumno;
                $candidatura->nombreEmpresa= $nombreEmpresa;

                // Ocultar completamente los objetos "alumno" y "empresa"
                $candidatura->makeHidden(['alumno', 'empresa']);
            }

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $candidaturas
            ], Response::HTTP_OK);
        }else {
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
        if ($this->user->rol=="docente") {
            // Indicamos que solo queremos recibir alumno_id y empresa_id de la request
            $data = $request->only('alumno_id', 'empresa_id');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'alumno_id' => 'exists:alumnos,id',
                'empresa_id' => 'exists:empresas,id',
            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails())
            {
                return response()->json(['error' => $validator->messages()], 400);
            }

            //Miramos si ya existe una candidatura con los datos introducidos
            $existingCandidaturasCount = Candidatura::where('alumno_id', $data ["alumno_id"])
                ->where('empresa_id', $data ["empresa_id"])
                ->count();
            //si existe devolvemos un mensaje de error
            if ($existingCandidaturasCount > 0) {
                return response()->json([
                    'error' => 'Ya existe una candidatura exactamente igual.'
                ], 400);
            }

            // Creamos la nueva empresa si todo es correcto
            $candidatura = Candidatura::create([
                'alumno_id' =>  $request->alumno_id,
                'empresa_id' =>  $request->empresa_id
            ]);

            // Devolvemos la respuesta con los datos del empresa
            return response()->json([
                'exito' => true,
                'mensaje' => 'Candidatura creada correctamente',
                'data' => $candidatura
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
        //
        $candidatura = Candidatura::find($id);

        // Si la candidatura no existe devolvemos error no encontrado
        if (!$candidatura)
        {
            return response()->json([
                'mensaje' => 'candidatura no encontrada.'
            ], 404);
        }

        if ($this->user->rol=="docente" || $this->user->id==$candidatura->alumno_id){
            $datosAlumno = Candidatura::find($id)->alumno->user;
            $datosEmpresa = Candidatura::find($id)->empresa;

            $candidatura->alumno->user = $datosAlumno;
            $candidatura->empresa = $datosEmpresa;

            // Devolvemos la candidatura
            return response()->json([
                'data' => $candidatura
            ], Response::HTTP_OK);
        }else{
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
    public function cambiarEstado(Request $request, $id)
    {
        //
        if ($this->user->rol=="docente") {
            // Buscamos la candidatura 
            $candidatura = Candidatura::find($id);

            // Si la candidatura no existe devolvemos error no encontrada
            if (!$candidatura)
            {
                return response()->json([
                    'mensaje' => 'candidatura no encontrada.'
                ], 404);
            }

            $data= $request->only('estado');

            //Realizamos las validaciones
            $validator = Validator::make($data, [
                'estado' => 'in:aceptada,rechazada,pendiente',
            ]);

            // Devolvemos un error si fallan las validaciones
            if ($validator->fails())
            {
                return response()->json(['error' => $validator->messages()], 400);

            }elseif($request->estado!="rechazada"){
                //Miramos si el alumno tiene ya existe una candidatura aceptada 
                $aceptedCandidaturasCount = Candidatura::where('estado', "aceptada")
                ->where('alumno_id', $candidatura->alumno_id)->count();
                
                //si existe devolvemos un mensaje de error
                if ($aceptedCandidaturasCount > 0) {
                    return response()->json([
                        'error' => 'Ya han aceptado a este alumno en otra empresa.'
                    ], 400);
                }
            }
            
            //modificamos el estado y guardamos
            $candidatura->estado = $request->estado;

            $candidatura->save();

            return response()->json([
                'mensaje' => 'Estado de la candidatura cambiado correctamente'
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
        //
        if ($this->user->rol=="docente") {
            $candidatura = Candidatura::find($id);

            // Si la candidatura no existe devolvemos error no encontrado
            if (!$candidatura)
            {
                return response()->json([
                    'mensaje' => 'candidatura no encontrada.'
                ], 404);
            }else{
                // Eliminamos la candidatura
                $candidatura->delete();

                // Devolvemos la respuesta
                return response()->json([
                    'mensaje' => 'candidatura borrada correctamente'
                ], Response::HTTP_OK);
            }
        }else {
            return response()->json([
                'mensaje' => 'No tienes permiso'
            ], 401);
        }
    }
}
