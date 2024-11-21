import { IsEmail, IsString } from 'class-validator';
export class SignUpDto {
  @IsEmail()
  email: string;
  @IsString()
  userName: string;
  @IsString()
  password: string;
}
