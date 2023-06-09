import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CandidaturaService } from '../service/candidatura.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-candidatura-alumno',
  templateUrl: './candidatura-alumno.component.html',
  styleUrls: ['./candidatura-alumno.component.css']
})
export class CandidaturaAlumnoComponent {
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
    const id =this.activatedRouter.snapshot.params['id'];
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      this.toastr.error("Necesitas estar Conectado", 'Fail');
    }else{
      this.idCurrentUser().then((currentUserid: number | void) => {
        if (currentUserid !== undefined && (this.common.isDocente() || currentUserid == id)) {
          this.CandidaturaService.candidaturasAlumno(id).subscribe({
            next: (v) => {
              this.datos = v.data;
              console.info("candidatura: ", this.datos);
            },
            error: (e) => {
              if (e.error.hasOwnProperty('mensaje')) {
                // Clave 'mensaje' existe en el objeto de errores
                const mensajeError = e.error.mensaje;
                this.toastr.error(mensajeError, 'FAIL');
                this.router.navigate(['/login']);
              }
            },
            complete: () => console.info('Candidaturas cargadas'),
          });
        } else {
          this.router.navigate(['/login']);
          this.toastr.error("No puedes Acceder a datos de otros Alumnos", 'FAIL');
        }
      });
    }
  }

  borrarCandidatura(id:number){
    if (confirm('¿Seguro que quieres eliminar esta candidatura?')) {
      this.CandidaturaService.borrarCandidatura(id).subscribe({
        next: (v) => {
          console.info("candidatura: ", this.datos);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
        },
        complete: () => console.info('Candidatura Borrada'),
      });
    }else{
      this.toastr.info("Has cancelado el borrado de una candidatura")
    }
  }
  
  public idCurrentUser= this.common.idCurrentUser;

  public isAlumno= this.common.isAlumno;
  public isDocente= this.common.isDocente;

  public isLoggedIn= this.common.isLoggedIn;
}
