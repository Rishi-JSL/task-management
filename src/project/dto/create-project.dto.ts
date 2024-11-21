import { IsEmail, IsString } from 'class-validator';

export class CreateUserProjectDto {
  @IsEmail()
  email: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
}
