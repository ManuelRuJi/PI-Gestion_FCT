import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { SedeService } from '../service/sede.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-detalle-sede',
  templateUrl: './detalle-sede.component.html',
  styleUrls: ['./detalle-sede.component.css']
})
export class DetalleSedeComponent {
  plantilla = JSON.stringify({
    id: 0,
    nombre:"",
    cif:"",
    num_empleado: "0",
    sedes: [{
      id: 0,
    },]
  });

  datos = JSON.parse(this.plantilla);

  edit = false;

  constructor(
    private authservice: AuthService,
    private SedeService: SedeService,
    private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private common: CommonService
  ) {}

  ngOnInit() {
    const id = this.activatedRouter.snapshot.params['id'];

    if (this.common.isLoggedIn()) {
      this.idCurrentUser().then((currentUserid: number | void) => {
        //miramos si el usuario actual es profesor o si es el alumno al que le pertenece la Empresa
        if (currentUserid !== undefined && this.common.isDocente()) {
          this.rellenarSede(id);
        } else {
          this.router.navigate(['/login']);
          this.toastr.error(
            'Necesitas ser profesor',
            'FAIL'
          );
        }
      });
    } else {
      this.toastr.error('Necesitas estar logeado', 'FAIL');
      this.router.navigate(['/login']);
    }
  }

  rellenarSede(id: number) {
    this.SedeService.detallesSede(id).subscribe({
      next: (v) => {
        this.datos = v.data;
        console.info('sede: ', this.datos);
      },
      error: (e) => {
        if (e.error.hasOwnProperty('mensaje')) {
          // Clave 'mensaje' existe en el objeto de errores
          const mensajeError = e.error.mensaje;
          this.toastr.error(mensajeError, 'FAIL');
          this.router.navigate(['/login']);
        }
      },
      complete: () => console.info('Detalles sede cargados'),
    });
  }

  public isAlumno = this.common.isAlumno;
  public isDocente = this.common.isDocente;

  public idCurrentUser = this.common.idCurrentUser;
}
