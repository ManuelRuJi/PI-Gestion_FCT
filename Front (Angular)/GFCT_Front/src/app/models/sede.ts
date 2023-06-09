export class Sede {
    id?: number;
    nombre: string;
    direccion:string;
    telefono:number;
    empresa_id:number;
    data?:any;

    constructor(nombre: string,direccion:string,telefono:number,empresa_id:number){
        this.nombre=nombre;
        this.direccion=direccion;
        this.telefono=telefono;
        this.empresa_id=empresa_id;
    }
}
