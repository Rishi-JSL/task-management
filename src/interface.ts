export interface IServerSecrets {
  jwtSecrets: IJwtSecrets;
  databaseUrl: string;
}

export interface IJwtSecrets {
  algorithm: string;
  expiresIn: string;
  secret: string;
}

export interface IJwtTokenUserData {
  userName: string;
  Id: string;
  email: string;
  iat: number;
  exp: number;
}
