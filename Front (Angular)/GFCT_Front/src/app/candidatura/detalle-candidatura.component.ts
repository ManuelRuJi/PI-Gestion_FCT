import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { CandidaturaService } from '../service/candidatura.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-detalle-candidatura',
  templateUrl: './detalle-candidatura.component.html',
  styleUrls: ['./detalle-candidatura.component.css'],
})
export class DetalleCandidaturaComponent {
  plantilla = JSON.stringify({
    id: 0,
    alumno: {
      id: 0,
      user: {
        id: 0,
      },
    },
    empresa: {
      id: 0,
    },
  });

  datos = JSON.parse(this.plantilla);

  edit = false;

  constructor(
    private authservice: AuthService,
    private CandidaturaService: CandidaturaService,
    private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit() {
    const id = this.activatedRouter.snapshot.params['id'];

    if (this.common.isLoggedIn()) {
      this.idCurrentUser().then((currentUserid: number | void) => {
        this.idAlumnoCandidatura(id).then((alumnoid: number | void) => {
          //miramos si el usuario actual es profesor o si es el alumno al que le pertenece la candidatura
          if (
            currentUserid !== undefined &&
            (this.common.isDocente() || currentUserid == alumnoid)
          ) {
            this.rellenarCandidatura(id);
          } else {
            console.log(currentUserid, alumnoid);

            this.router.navigate(['/login']);
            this.toastr.error(
              'No puedes Acceder a datos de otros Alumnos',
              'FAIL'
            );
          }
        });
      });
    } else {
      this.toastr.error('Necesitas estar logeado', 'FAIL');
      this.router.navigate(['/login']);
    }
  }

  toggleState() {
    this.edit = this.edit ? false : true;
  }

  CambiarEstado() {
    if (this.esEstadoValido(this.datos.estado)) {
      this.CandidaturaService.cambiarEstado(
        this.datos.estado,
        this.datos.id
      ).subscribe({
        next: (v) => {
          this.toggleState();
          console.info('Estado cambiado');
        },
        error: (e) => {
          
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
            this.router.navigate(['/login']);
          }
          if (e.error.hasOwnProperty('error')) {
            const errores = e.error.error; // Objeto de errores
            this.toastr.error(errores, 'FAIL');
          }
        },
        complete: () => console.info('Detalles candidatura cargados'),
      });
    } else {
      console.log('Estado inválido. Verifica los campos.');
    }
  }

  private esEstadoValido(estado: string): boolean {
    const opcionesValidas = ['aceptada', 'rechazada', 'pendiente'];
    return opcionesValidas.includes(estado);
  }

  rellenarCandidatura(id: number) {
    this.CandidaturaService.ShowCandidatura(id).subscribe({
      next: (v) => {
        this.datos = v.data;
        console.info('candidatura: ', this.datos);
      },
      error: (e) => {
        if (e.error.hasOwnProperty('mensaje')) {
          // Clave 'mensaje' existe en el objeto de errores
          const mensajeError = e.error.mensaje;
          this.toastr.error(mensajeError, 'FAIL');
          this.router.navigate(['/login']);
        }
      },
      complete: () => console.info('Detalles candidatura cargados'),
    });
  }

  public isAlumno = this.common.isAlumno;
  public isDocente = this.common.isDocente;

  public idAlumnoCandidatura = this.common.idAlumnoCandidatura;
  public idCurrentUser = this.common.idCurrentUser;
}
