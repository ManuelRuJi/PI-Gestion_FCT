export class Empresa {
  id?: number;
  nombre: string;
  cif: string;
  num_empleado: number;
  data?:any;

  constructor(nombre: string, cif: string, num_empleados: number) {
    this.nombre = nombre;
    this.cif = cif;
    this.num_empleado = num_empleados;
  }
}
