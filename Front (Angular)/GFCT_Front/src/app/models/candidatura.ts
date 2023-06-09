export class Candidatura {
  id?: number;
  estado: string;
  alumno_id: number;
  empresa_id: number;
  data?:any;
  
  constructor(estado: string, alumno: number, empresa: number) {
    this.estado = estado;
    this.alumno_id = alumno;
    this.empresa_id = empresa;
  }
}
