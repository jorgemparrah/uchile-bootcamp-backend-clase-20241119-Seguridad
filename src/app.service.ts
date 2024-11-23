import * as Crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredencialesDto } from './dto/credenciales.dto';
import { Usuario } from './usuario.entity';
import { JwtService } from '@nestjs/jwt';
import { Roles } from './enum/roles.enum';

@Injectable()
export class AppService {

  password : string;
  iv: Buffer;
  modo: string;
  usuarios: Usuario[];

  constructor(
    private readonly jwtService: JwtService
  ) {
    this.password = 'ABCDE-F56789ABCDE-F56789ABCDE-F5';
    this.iv = Crypto.randomBytes(16);
    this.modo = 'AES-256-CBC';

    this.usuarios = [
      new Usuario('12.345.678-9', 'Juan Pérez', 'juan.perez@mail.com', 'caf4d3bd84631e177e7c6349dc29365d', Roles.ADMIN),
      new Usuario('11.222.333-4', 'María González', 'maria.gonzalez@mail.com', 'caf4d3bd84631e177e7c6349dc29365d', Roles.USER),
      new Usuario('9.876.543-2', 'Pedro Pérez', 'pedrop@mail.com', 'caf4d3bd84631e177e7c6349dc29365d', Roles.GUEST)
    ];
  }

  getHello(): string {
    return 'Hello World!';
  }

  encriptar(textoOriginal: string): string {
    let cipher = Crypto.createCipheriv(this.modo, Buffer.from(this.password), this.iv);
    const textoEncriptado = Buffer.concat([
      cipher.update(textoOriginal), cipher.final()
    ]);
    return textoEncriptado.toString('base64');
  }

  desencriptar(textoEncriptado: string): string {
    const textoBuffer = Buffer.from(textoEncriptado, 'base64');
    let decipher = Crypto.createDecipheriv(this.modo, Buffer.from(this.password), this.iv);
    let decrypted = Buffer.concat([
      decipher.update(textoBuffer),
      decipher.final()
    ]);
    const textoOriginal = decrypted.toString();
    return textoOriginal;
  }

  hashing(textoOriginal: string): string {
    const modo = 'md5';
    const modificador = `${textoOriginal}-12346498744197464`;
    const hash = Crypto.createHash(modo).update(modificador).digest('hex');
    return hash;
  }

  login(credenciales: CredencialesDto): string {
    // IDENTIFICACION
    const usuario = this.usuarios.find(u => u.rut === credenciales.usuario);
    if (!usuario) {
      throw new UnauthorizedException("Usuario o contraseña no es válido");
    }
    // AUTENTICACION
    const hash = this.hashing(credenciales.password);
    if (usuario.clave !== hash) {
      throw new UnauthorizedException("Usuario o contraseña no es válido");
    }
    // JWT
    const payload = {
      rut: usuario.rut,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  refresh(datosUsuario: any): string {
    // JWT
    const payload = {
      rut: datosUsuario.rut,
      nombre: datosUsuario.nombre,
      correo: datosUsuario.correo
    };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  metodoProtegido(mensaje: string, datosUsuario: any): string {
    return `Este es un mensaje protegido del usuario (${datosUsuario.nombre}): [${mensaje}]`;
  }
}
