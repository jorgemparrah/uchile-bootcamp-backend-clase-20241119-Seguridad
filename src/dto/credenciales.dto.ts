import { ApiProperty } from "@nestjs/swagger";

export class CredencialesDto {

  @ApiProperty({ example: '12.345.678-9', description: 'Nombre de usuario' })
  usuario: string;

  @ApiProperty({ example: '12345', description: 'Clave de acceso' })
  password: string;
}