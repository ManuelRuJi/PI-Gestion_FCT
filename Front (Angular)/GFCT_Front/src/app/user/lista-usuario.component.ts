import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { AlumnoService } from '../service/alumno.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent {
  plantilla = JSON.stringify({
    id:0,
    docentes:{},
    alumnos:{}
  });

  datos=JSON.parse(this.plantilla);

  currentUserid:number|void=0;

  constructor(
    private authservice:AuthService,
    private UsuarioService:UsuarioService,
    private AlumnoService:AlumnoService,
    private activatedRouter:ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private common:CommonService) { };
  
    ngOnInit(){
      if (!this.isLoggedIn()) {
        this.router.navigate(['/login']);
        this.toastr.error("Necesitas estar Conectado", 'Fail');
      }else{
        this.idCurrentUser().then((currentUserid: number | void) => {
          if (currentUserid !== undefined && this.common.isDocente()){
            this.cargarUsuario();
          } else {
            this.router.navigate(['/login']);
            this.toastr.error("No puedes Acceder sin ser profesor", 'FAIL');
          }
        });
      }
    }

    cargarUsuario():void{
      this.UsuarioService.listaDocente().subscribe({
        next: (v) => {
          this.datos.docentes = v.data;
          console.info("Docentes: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Lista Docentes Cargada'),
      });
      this.AlumnoService.listaAlumno().subscribe({
        next: (v) => {
          this.datos.alumnos = v.data;
          console.info("Alumnos: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Lista Alumnos Cargada'),
      });
    }
    borrarUsuario(id:number){
      Swal.fire({
        title: '¿Seguro que quieres eliminar este docente?',
        showDenyButton: true,
        confirmButtonText: 'Estoy seguro',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.UsuarioService.borrarUsuario(id).subscribe({
            next: (v) => {
              Swal.fire({
                icon: 'success',
                title: 'Docente Borrado',
                showConfirmButton: false,
                timer: 1500
              })
              this.cargarUsuario();
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
              }
            },
            complete: () => console.info('Docente borrado'),
          });
          
        } else if (result.isDenied) {
          Swal.fire('Has cancelado el borrado de un docente', '', 'info')
        }
      })
    }

    borrarAlumno(id:number){
      Swal.fire({
        title: '¿Seguro que quieres eliminar este Alumno?',
        showDenyButton: true,
        confirmButtonText: 'Estoy seguro',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.AlumnoService.borrarAlumno(id).subscribe({
            next: (v) => {
              Swal.fire({
                icon: 'success',
                title: 'Alumno Borrado',
                showConfirmButton: false,
                timer: 1500
              })
              this.cargarUsuario();
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
              }
            },
            complete: () => console.info('Alumno borrado'),
          });
          
        } else if (result.isDenied) {
          Swal.fire('Has cancelado el borrado de un alumno', '', 'info')
        }
      })
    }

    public idCurrentUser= this.common.idCurrentUser;
  
    public isAlumno= this.common.isAlumno;
    public isDocente= this.common.isDocente;
  
    public isLoggedIn= this.common.isLoggedIn;
}
