import { IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;
  @IsString()
  description: string;
  @IsString()
  title: string;
  @IsNumber()
  priority: number;
  @IsNumber()
  days: number;
}
