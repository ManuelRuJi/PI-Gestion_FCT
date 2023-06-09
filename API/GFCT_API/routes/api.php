<?php

use App\Http\Controllers\AlumnoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticuloController;
use App\Http\Controllers\CandidaturaController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SedeController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

// login de usuario
Route::post('login', [AuthController::class, 'authenticate']);

Route::group(['middleware' => ['jwt.verify']], function () {
    // Todo lo que este dentro de este grupo requiere verificación de usuario.

    // Rutas de autorización
    // registro de usuarios
    Route::post('register', [AuthController::class, 'register']);
    // logout usuario conectado
    Route::post('logout', [AuthController::class, 'logout']);
    // detalles de alumno conectado
    Route::get('user', [AuthController::class, 'getUser']);

    // Rutas de usuarios
    // Lista de Usuarios
    Route::get('usuario', [UserController::class, 'index']);
    // Lista de docente
    Route::get('docente', [UserController::class, 'ListaProfesores']);
    // Detalles de usuario
    Route::get('usuario/{id}', [UserController::class, 'show']);
    // Actualizar usuario
    Route::put('usuario/{id}/update', [UserController::class, 'update']);
    // borrar docente
    Route::delete('delete/docente/{id}', [UserController::class, 'destroy']);

    // Rutas de Alumnos
    // Lista de Alumnos
    Route::get('alumno', [AlumnoController::class, 'index']);
    // Subir CV del alumno
    Route::post('alumno/subirCV/{id}', [AlumnoController::class, 'subirCV']);
    // Conseguir CV del Alumno
    Route::get('alumno/getCV/{id}', [AlumnoController::class, 'getCV']);
    // Cambiar profesor seguimiento
    Route::patch('alumno/profesor/{id}', [AlumnoController::class, 'cambiarProfesor']);
    // borrar alumno
    Route::delete('delete/alumno/{id}', [AlumnoController::class, 'destroy']);

    // Rutas de Empresas.
    // Lista de Empresas.
    Route::get('empresa', [EmpresaController::class, 'index']);
    // Detalles de Empresa
    Route::get('empresa/{id}', [EmpresaController::class, 'show']);
    // Crear Empresa
    Route::post('empresa/create', [EmpresaController::class, 'store']);
    // Actualizar Empresa
    Route::put('empresa/{id}/update', [EmpresaController::class, 'update']);
    // Borrar Empresa
    Route::delete('delete/empresa/{id}', [EmpresaController::class, 'destroy']);

    // Rutas de Sedes.
    // Lista de Sedes.
    Route::get('sede', [SedeController::class, 'index']);
    // Detalles de sede
    Route::get('sede/{id}', [SedeController::class, 'show']);
    // Crear sede
    Route::post('sede/create', [SedeController::class, 'store']);
    // Actualizar sede
    Route::put('sede/{id}/update', [SedeController::class, 'update']);
    // Borrar sede
    Route::delete('delete/sede/{id}', [SedeController::class, 'destroy']);

    // Rutas de Candidaturas.
    // Lista de Candidaturas.
    Route::get('candidatura', [CandidaturaController::class, 'index']);
    // Lista de Candidaturas de un alumno.
    Route::get('candidatura/alumno/{id}', [CandidaturaController::class, 'listaCandidaturaAlumno']);
    // Detalles de candidatura
    Route::get('candidatura/{id}', [CandidaturaController::class, 'show']);
    // Crear candidatura
    Route::post('candidatura/create', [CandidaturaController::class, 'store']);
    // Cambiar estado de candidatura
    Route::patch('candidatura/{id}/estado', [CandidaturaController::class, 'cambiarEstado']);
    // Borrar candidatura candidatura/alumno/2
    Route::delete('delete/candidatura/{id}', [CandidaturaController::class, 'destroy']);
});
