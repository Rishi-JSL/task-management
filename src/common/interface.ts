import { User } from 'src/user/schema/user.schema';
// import { IUserData } from 'src/user/user.service';

export interface IErrorResponse {
  error?: string;
}
export interface IServerResponse extends IErrorResponse {
  data?: unknown;
}

export interface ISignInUserResponse extends Omit<IServerResponse, 'data'> {
  data?: {
    accessToken: string;
  };
}

export interface IGetAllUsersResponse extends Omit<IServerResponse, 'data'> {
  data?: {
    users: User[];
  };
}
