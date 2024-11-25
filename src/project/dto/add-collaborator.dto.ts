import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleType } from 'src/role/schema/user-role.schema';

export class addCollaboratorDto {
  @IsString()
  projectId: string;

  @IsEmail()
  collaboratorEmail: string;

  @IsString()
  @IsNotEmpty()
  role: UserRoleType;
}
