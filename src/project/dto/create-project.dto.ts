import { IsString } from 'class-validator';

export class CreateUserProjectDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}
