import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CredencialesDto } from './dto/credenciales.dto';
import { EjemploDto } from './dto/ejemplo.dto';
import { JwtGuard } from './guard/jwt.guard';
import { RolesPermitidos } from './decorator/roles.decorator';
import { Roles } from './enum/roles.enum';
import { ValidarRolesGuard } from './guard/validar-roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("encriptar/:texto")
  encriptar(@Param("texto") texto: string): string {
    return this.appService.encriptar(texto);
  }

  @Post("desencriptar/:texto")
  desencriptar(@Param("texto") texto: string): string {
    return this.appService.desencriptar(texto);
  }

  @Post("hash/:texto")
  hashing(@Param("texto") texto: string): string {
    return this.appService.hashing(texto);
  }

  @ApiBody({ type: CredencialesDto })
  @Post("login")
  login(@Body() credenciales: CredencialesDto): string {
    return this.appService.login(credenciales);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiBody({ type: EjemploDto })
  @Post("refresh")
  refresh(@Req() request, @Body() body : EjemploDto): string {
    const datosUsuario = request.infoUsuario;
    return this.appService.refresh(datosUsuario);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiBody({ type: EjemploDto })
  @Post("metodoProtegido")
  metodoProtegido(@Req() request, @Body() body : EjemploDto): string {
    const datosUsuario = request.infoUsuario;
    return this.appService.metodoProtegido(body.info, datosUsuario);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, ValidarRolesGuard)
  @RolesPermitidos(Roles.ADMIN)
  @ApiBody({ type: EjemploDto })
  @Post("permitidoSoloAdmin")
  permitidoSoloAdmin(@Req() request, @Body() body : EjemploDto): string {
    const datosUsuario = request.infoUsuario;
    return `${datosUsuario.nombre} es del rol: [${datosUsuario.rol}]}`;
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, ValidarRolesGuard)
  @RolesPermitidos(Roles.GUEST)
  @ApiBody({ type: EjemploDto })
  @Post("permitidoSoloGuest")
  permitidoSoloGuest(@Req() request, @Body() body : EjemploDto): string {
    const datosUsuario = request.infoUsuario;
    return `${datosUsuario.nombre} es del rol: [${datosUsuario.rol}]}`;
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, ValidarRolesGuard)
  @RolesPermitidos(Roles.ADMIN, Roles.USER)
  @ApiBody({ type: EjemploDto })
  @Post("permitidoAdminYUser")
  permitidoAdminYUser(@Req() request): string {
    const datosUsuario = request.infoUsuario;
    return `${datosUsuario.nombre} es del rol: [${datosUsuario.rol}]}`;
  }
}
