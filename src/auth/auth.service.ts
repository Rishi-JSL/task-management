import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISignInUserResponse } from 'src/common/interface';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

export enum UserError {
  UserAlreadyExist = 'userAlreadyExist',
  UserNotFound = 'userNotFound',
  CollaboratorNotFound = 'collaboratorNotFound',
  PermissionDenied = 'permissionDenied',
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<ISignInUserResponse> {
    const user = await this.usersService.findUser(email);
    // TODO: decrypt/hashed the incoming pass and then check
    if (user?.password !== pass) {
      return { error: UserError.UserNotFound };
    }
    const accessToken = await this.getUserToken(
      user.id,
      user.email,
      user.userName,
    );
    return {
      data: { accessToken: accessToken },
    };
  }

  async signUp(
    userName: string,
    email: string,
    password: string,
  ): Promise<ISignInUserResponse> {
    if (await this.usersService.isUserExist(email)) {
      return { error: UserError.UserAlreadyExist };
    }
    // TODO: encrypt/hashed the password before saving
    const createUserReq: User = {
      userName: userName,
      email: email,
      password: password,
    };

    const user = await this.usersService.create(createUserReq);
    const accessToken = await this.getUserToken(
      user.id,
      user.email,
      user.userName,
    );

    return { data: { accessToken: accessToken } };
  }

  private async getUserToken(id: string, email: string, userName: string) {
    return this.jwtService.signAsync(
      this.getUserTokenParams(id, email, userName),
    );
  }

  private getUserTokenParams(id: string, email: string, userName: string) {
    return {
      userName: userName,
      Id: id,
      email: email,
    };
  }
}
