import { ApiProperty } from "@nestjs/swagger";

export class EjemploDto {

  @ApiProperty({ example: '123456789asdfghjkl', description: 'Datos de ejemplo' })
  info: string;

  @ApiProperty({ example: '12345', description: 'JWT' })
  jwt: string;
}