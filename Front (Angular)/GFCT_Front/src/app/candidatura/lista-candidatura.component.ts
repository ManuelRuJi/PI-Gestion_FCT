import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { CandidaturaService } from '../service/candidatura.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-lista-candidatura',
  templateUrl: './lista-candidatura.component.html',
  styleUrls: ['./lista-candidatura.component.css']
})
export class ListaCandidaturaComponent {
  plantilla = JSON.stringify({
    id:0,
    estado: "",
    alumno_id: "",
    empresa_id: 0,
    nombreAlumno: "",
    nombreEmpresa: ""
  });

  datos=JSON.parse(this.plantilla);

  currentUserid:number|void=0;

  constructor(
    private authservice:AuthService,
    private CandidaturaService:CandidaturaService,
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
            this.cargarCandidatura();
          } else {
            this.router.navigate(['/login']);
            this.toastr.error("No puedes Acceder a datos de otros Alumnos", 'FAIL');
          }
        });
      }
    }

    cargarCandidatura():void{
      this.CandidaturaService.ListaCandidatura().subscribe({
        next: (v) => {
          this.datos = v.data;
          console.info("candidaturas: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Detalles Cargados'),
      });
    }
    borrarCandidatura(id:number){
      Swal.fire({
        title: '¿Seguro que quieres eliminar esta candidatura?',
        showDenyButton: true,
        confirmButtonText: 'Estoy seguro',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.CandidaturaService.borrarCandidatura(id).subscribe({
            next: (v) => {
              Swal.fire({
                icon: 'success',
                title: 'Candidatura Borrado',
                showConfirmButton: false,
                timer: 1500
              })
              this.cargarCandidatura();
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
              }
            },
            complete: () => console.info('Candidatura borrado'),
          });
          
        } else if (result.isDenied) {
          Swal.fire('Has cancelado el borrado de una candidatura', '', 'info')
        }
      })
    }

    public idCurrentUser= this.common.idCurrentUser;
  
    public isAlumno= this.common.isAlumno;
    public isDocente= this.common.isDocente;
  
    public isLoggedIn= this.common.isLoggedIn;
}
