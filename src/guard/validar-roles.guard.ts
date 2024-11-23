import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CLAVE_ROLES } from 'src/decorator/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class ValidarRolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // INFORMACION DEL USUARIO LOGUEADO
    const request = context.switchToHttp().getRequest();
    const rolUsuarioAutenticado = request.infoUsuario.rol;
    console.log("ROL USUARIO AUTENTICADO", rolUsuarioAutenticado);

    // INFORMACION DEL DECORADOR DE ROLES
    const requeridos = this.reflector.getAllAndOverride<Roles[]>(CLAVE_ROLES, [ context.getHandler(), context.getClass() ]);
    const encontrado = requeridos.find(rol => rol === rolUsuarioAutenticado);
    if (!encontrado) {
      return false;
    }
    return true;
  }

}
