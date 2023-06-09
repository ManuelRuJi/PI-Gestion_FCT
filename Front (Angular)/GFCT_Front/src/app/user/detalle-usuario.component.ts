import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';
import { CommonService } from '../service/common.service';
import { AuthService } from '../service/auth.service';
import { UsuarioService } from '../service/usuario.service';
import { AlumnoService } from '../service/alumno.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent {

  plantilla = JSON.stringify({
    id:0,
    alumno: {
        
    }
  });

  datos=JSON.parse(this.plantilla);

  selectedFile: File | undefined;
  isCV:boolean=false;
  currentUserid:number|void=1;

  constructor(
    private authservice:AuthService,
    private UsuarioService:UsuarioService,
    private AlumnoService:AlumnoService,
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
          this.UsuarioService.detalles(id).subscribe({
            next: (v) => {
              this.datos = v.data;
              if (this.datos.rol=="alumno") {
                if (this.datos.alumno.CV != "") {
                  this.toggleCV();
                  this.colocarPDF();
                }
              }
              console.info("usuario: ", this.datos);
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
        } else {
          this.router.navigate(['/login']);
          this.toastr.error("No puedes acceder a datos de otros Alumnos", 'FAIL');
        }
      });
    }
  }

  colocarPDF(){    
    if (this.isCV) {
      this.getPDF();
    }
  }

  toggleCV(){
    this.isCV=this.isCV? false:true;
  }

  getPDF() {
    this.AlumnoService.getCV(this.datos.id, ).subscribe({
      next: (response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        console.log(file);
        
        // Crear una URL segura para el contenido del PDF
        const url = URL.createObjectURL(file);
  
        // Asignar la URL segura al atributo src del elemento <embed>
        const pdfViewElement = document.getElementById('pdf-view') as HTMLEmbedElement;
        pdfViewElement.src = url;        
      },
      error: (e) => {
        if (e.error.hasOwnProperty('mensaje')) {
          // Clave 'mensaje' existe en el objeto de errores
          const mensajeError = e.error.mensaje;
          this.toastr.error(mensajeError, 'FAIL');
        }
        console.error(e);
  
        this.router.navigate(['/login']);
      },
      complete: () => console.info('PDF conseguido'),
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadCV(id:number) {
    if (this.selectedFile) {
      
      this.AlumnoService.updateCV(id,this.selectedFile).subscribe({
        next: (v) => {
          this.toastr.success(v.mensaje, 'OK');
          this.datos.alumno.CV=`${this.datos.id}.pdf`
          this.toggleCV();
          this.getPDF();
          this.router.navigate(['/usuario/'+id]);
        },
        error: (e) => {
          if (e.error.hasOwnProperty('mensaje')) {
            // Clave 'mensaje' existe en el objeto de errores
            const mensajeError = e.error.mensaje;
            this.toastr.error(mensajeError, 'FAIL');
          }
          this.router.navigate(['/usuario/'+id]);
        },
        complete: () => console.info('PDF guardado'),
      });
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  }
  public idCurrentUser= this.common.idCurrentUser;

  public isAlumno= this.common.isAlumno;

  public isLoggedIn= this.common.isLoggedIn;
}
