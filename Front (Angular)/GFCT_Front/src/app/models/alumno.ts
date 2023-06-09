export class Alumno {
  id: number;
  CV: string;
  profesor_seguimiento_id: number;
  data?:any;

  constructor(id: number, cv: string, profesor: number) {
    this.id = id;
    this.CV = cv;
    this.profesor_seguimiento_id = profesor;
  }
}
