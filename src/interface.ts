export interface IServerSecrets {
  jwtSecrets: IJwtSecrets;
  databaseUrl: string;
}

export interface IJwtSecrets {
  algorithm: string;
  expiresIn: string;
}
