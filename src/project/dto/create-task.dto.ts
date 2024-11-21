import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;
  @IsString()
  description: string;
  @IsString()
  title: string;
  @IsString()
  priority: number;
  @IsNumber()
  days: number;
}
