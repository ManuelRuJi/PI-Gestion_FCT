<?php

namespace App\Http\Controllers;

use JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Alumno;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AlumnoController extends Controller
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
            //  Listamos todos los alumnos
            $alumnos = Alumno::with('user')->get();

            // Respuesta en caso de que todo vaya bien.
            return response()->json([
                'data' => $alumnos
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function subirCV($id)
    {
        //
        if ($this->user->rol=="docente" || $this->user->id == $id){
            // Buscamos el alumno 
            $alumno = Alumno::find($id);
                    
            // Si el alumno no existe devolvemos error no encontrado
            if (!$alumno)
            {
                return response()->json([
                    'mensaje' => 'alumno no encontrado.'
                ], 404);
            }elseif ($_FILES["cv"]["size"]>0) {
                $file = $_FILES["cv"];

                $extension = $file["type"];

                if ($extension=="application/pdf") {

                    $pdf= $id.'.pdf';

                    move_uploaded_file($file["tmp_name"],
                    public_path('CV/'.$pdf));

                    $alumno->cv = 'CV/'.$pdf;
                    $alumno->save();

                    return response()->json([
                        'mensaje' => 'PDF subido correctamente'
                    ], Response::HTTP_OK);
                }else{
                    return response()->json([
                        'mensaje' => 'Solo se acepta archivos PDF'
                    ], 404);
                }
                
            }
            else
            {
                return response()->json([
                    'mensaje' => 'PDF no encontrado'
                ], 404);
            }
        }else{
            return response()->json([
                'mensaje' => 'No tienes permiso para esto'
            ], 401);
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getCV($id)
    {
        //
        if ($this->user->rol == "docente" || $this->user->id == $id) {
            $alumno = Alumno::find($id);

            if (!$alumno) {
                return response()->json([
                    'mensaje' => 'Alumno no encontrado.'
                ], 404);

            } elseif (file_exists(public_path('CV/' . $id . '.pdf'))) {
                $file = public_path('CV/' . $id . '.pdf');

                // Obtener el contenido del archivo PDF
                $content = file_get_contents($file);

                // Establecer el encabezado de respuesta para indicar que es un archivo PDF
                $headers = [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="cv.pdf"'
                ];

                return response($content, 200, $headers);
            } else {
                return response()->json([
                    'mensaje' => 'PDF no encontrado.'
                ], 404);
            }
        } else {
            return response()->json([
                'mensaje' => 'No tienes permiso para esto.'
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
    public function cambiarProfesor(Request $request, $id)
    {
        // Buscamos el alumno 
        $alumno = Alumno::find($id);
                    
        // Si el alumno no existe devolvemos error no encontrado
        if (!$alumno)
        {
            return response()->json([
                'mensaje' => 'alumno no encontrado.'
            ], 404);
        }

        if ($this->user->id==$alumno->profesor_seguimiento_id){
            // Buscamos el alumno 
            $data= $request->only('profesor');
            $profesor = User::find($data["profesor"]);


            // Si el alumno no existe devolvemos error no encontrado
            if (!$profesor)
            {
                return response()->json([
                    'mensaje' => 'profesor no encontrado.'
                ], 404);
            }elseif($profesor->rol != "docente"){
                return response()->json([
                    'mensaje' => 'El usuario indicado es un alumno, no puede dar seguimiento.'
                ], 404);
            }else{
                
                $alumno->profesor_seguimiento_id = $profesor->id;

                $alumno->save();

                return response()->json([
                    'mensaje' => 'Profesor de seguimiento cambiado correctamente'
                ], Response::HTTP_OK);
            }

        }else{
            return response()->json([
                'mensaje' => 'No tienes permiso para esto'
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
            // Buscamos el alumno 
            $alumno = Alumno::find($id);
        
            // Si el alumno no existe devolvemos error no encontrado
            if (!$alumno)
            {
                return response()->json([
                    'mensaje' => 'alumno no encontrado.'
                ], 404);
            }
            //Buscamos si el alumno tiene candidaturas asociados
            $candidaturaAlumno = Alumno::find($id)->candidaturas;

            //Si el alumno tiene candidaturas no se puede borrar
            if (count($candidaturaAlumno) > 0 )
            {
                return response()->json([
                    'mensaje' => 'No se puede borrar el alumno por tener candidaturas asociadas.'
                ], 404);
            }
            else{
                // Eliminamos el alumno
                $alumno->delete();

                //buscamos el usuario al que hace referencia y lo borramos
                $usuario = User::find($id);
                $usuario->delete();
                
                // Devolvemos la respuesta
                return response()->json([
                    'mensaje' => 'Alumno borrado correctamente'
                ], Response::HTTP_OK);
            }
        }else {
            return response()->json([
                'mensaje' => 'No tienes permiso para esto'
            ], 401);
        }
    }
}
