import { Roles } from "./enum/roles.enum";

export class Usuario {
  rut: string;
  nombre: string;
  correo: string;
  clave: string;
  rol: Roles;

  constructor(rut: string, nombre: string, correo: string, clave: string, rol: Roles) {
    this.rut = rut;
    this.nombre = nombre;
    this.correo = correo;
    this.clave = clave;
    this.rol = rol;
  }
}