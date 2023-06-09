
export class User {
    id?: number;
    nombre: string;
    apellidos:string;
    edad:number;
    email:string;
    password:string;
    dni:string;
    telefono:number;
    rol:string;
    data?:any;

    constructor(nombre: string,apellidos:string,edad:number,email:string,password:string,dni:string,telefono:number,rol:string){
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.edad=edad;
        this.email=email;
        this.password=password;
        this.dni=dni;
        this.telefono=telefono;
        this.rol=rol;
    }
}

