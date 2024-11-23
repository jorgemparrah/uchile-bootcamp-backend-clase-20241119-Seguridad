import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    const jwt = request.headers.authorization.split(" ")[1];
    try {
      const infoJwt = await this.jwtService.verifyAsync(jwt);
      request.infoUsuario = infoJwt;
      return true;
    } catch(error) {
      console.log("ERROR-JWT", error);
      return false;
    }
  }
}
