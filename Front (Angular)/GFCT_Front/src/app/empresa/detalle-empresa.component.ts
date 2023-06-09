import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { EmpresaService } from '../service/empresa.service';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-detalle-empresa',
  templateUrl: './detalle-empresa.component.html',
  styleUrls: ['./detalle-empresa.component.css']
})
export class DetalleEmpresaComponent {
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
    private EmpresaService: EmpresaService,
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
          this.rellenarEmpresa(id);
        } else {
          this.router.navigate(['/login']);
          this.toastr.error(
            'No puedes Acceder a datos de otros Alumnos',
            'FAIL'
          );
        }
      });
    } else {
      this.toastr.error('Necesitas estar logeado', 'FAIL');
      this.router.navigate(['/login']);
    }
  }

  rellenarEmpresa(id: number) {
    this.EmpresaService.detallesEmpresa(id).subscribe({
      next: (v) => {
        this.datos = v.data;
        console.info('Empresa: ', this.datos);
      },
      error: (e) => {
        if (e.error.hasOwnProperty('mensaje')) {
          // Clave 'mensaje' existe en el objeto de errores
          const mensajeError = e.error.mensaje;
          this.toastr.error(mensajeError, 'FAIL');
          this.router.navigate(['/login']);
        }
      },
      complete: () => console.info('Detalles Empresa cargados'),
    });
  }

  public isAlumno = this.common.isAlumno;
  public isDocente = this.common.isDocente;

  public idCurrentUser = this.common.idCurrentUser;
}
