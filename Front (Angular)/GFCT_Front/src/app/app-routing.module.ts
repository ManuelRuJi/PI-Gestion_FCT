import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { ListaUsuarioComponent } from './user/lista-usuario.component';
import { DetalleUsuarioComponent } from './user/detalle-usuario.component';
import { CandidaturaAlumnoComponent } from './candidatura/candidatura-alumno.component';
import { EditarUsuarioComponent } from './user/editar-usuario.component';
import { DetalleCandidaturaComponent } from './candidatura/detalle-candidatura.component';
import { ListaCandidaturaComponent } from './candidatura/lista-candidatura.component';
import { RegisterComponent } from './auth/register.component';
import { ListaEmpresaComponent } from './empresa/lista-empresa.component';
import { CrearEmpresaComponent } from './empresa/crear-empresa.component';
import { UpdateEmpresaComponent } from './empresa/update-empresa.component';
import { DetalleEmpresaComponent } from './empresa/detalle-empresa.component';
import { ListaSedeComponent } from './sede/lista-sede.component';
import { DetalleSedeComponent } from './sede/detalle-sede.component';
import { CrearSedeComponent } from './sede/crear-sede.component';
import { UpdateSedeComponent } from './sede/update-sede.component';
import { CrearCandidaturaComponent } from './candidatura/crear-candidatura.component';

const routes: Routes = [
  { path: '', component: ListaUsuarioComponent },
  { path: 'usuario/:id', component: DetalleUsuarioComponent,title:'Gestión FCT | Detalle Usuario'},
  { path: 'usuario/:id/update', component: EditarUsuarioComponent,title:'Gestión FCT | Actualizar Usuario'},

  { path: 'empresa', component: ListaEmpresaComponent,title:'Gestión FCT | Listado Empresa'},
  { path: 'empresa/create', component: CrearEmpresaComponent,title:'Gestión FCT | Crear Empresa'},
  { path: 'empresa/:id', component: DetalleEmpresaComponent,title:'Gestión FCT | Detalle Empresa'},
  { path: 'empresa/:id/update', component: UpdateEmpresaComponent,title:'Gestión FCT | Actualizar Empresa'},

  { path: 'sede', component: ListaSedeComponent, title:'Gestión FCT | Listado Sedes'},
  { path: 'sede/create', component: CrearSedeComponent,title:'Gestión FCT | Crear Sedes'},
  { path: 'sede/:id', component: DetalleSedeComponent,title:'Gestión FCT | Detalle Sede'},
  { path: 'sede/:id/update', component: UpdateSedeComponent,title:'Gestión FCT | Actualizar Sede'},

  { path: 'candidatura', component: ListaCandidaturaComponent, title:'Gestión FCT | Listado Candidaturas'},
  { path: 'candidatura/create', component: CrearCandidaturaComponent,title:'Gestión FCT | Crear Candidaturas'},
  { path: 'candidatura/alumno/:id', component: CandidaturaAlumnoComponent,title:'Gestión FCT | Listado Candidatura Alumno'},
  { path: 'candidatura/:id', component: DetalleCandidaturaComponent,title:'Gestión FCT | Detalle Candidatura'},

  { path: 'register', component: RegisterComponent, title:'Gestión FCT | Registro Usuario'},
  { path: 'login', component: LoginComponent, title:'Gestión FCT | Login'},

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
