import { SetMetadata } from "@nestjs/common";
import { Roles } from "src/enum/roles.enum";

export const CLAVE_ROLES = 'CLAVE_PARA_ROLES_PERMITIDOS';
export const RolesPermitidos = (...params: Roles[]) => SetMetadata(CLAVE_ROLES, params);

