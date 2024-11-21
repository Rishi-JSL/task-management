import { IsEmail, IsString } from 'class-validator';
export class SignInDto {
  @IsEmail()
  // Todo: make it email caz user name can be same
  email: string;
  @IsString()
  password: string;
}
