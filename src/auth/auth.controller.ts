import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-In.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    const { userName, email, password } = signUpDto;
    return this.authService.signUp(userName, email, password);
  }
}
