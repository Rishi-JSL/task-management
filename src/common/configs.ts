import { IServerSecrets } from 'src/interface';
import * as configs from '../../secrets.json';

const secrets = configs as IServerSecrets;

export const jwtConfig = secrets.jwtSecrets;
export const databaseUrl = `mongodb://127.0.0.1/taskManager`;
