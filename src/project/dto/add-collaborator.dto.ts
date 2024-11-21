import { IsEmail, IsString } from 'class-validator';

export class addCollaboratorDto {
  @IsString()
  projectId: string;

  @IsEmail()
  collaboratorEmail: string;
}
