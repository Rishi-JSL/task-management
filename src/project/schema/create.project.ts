import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export interface ITask {
  taskId: string;
  tittle: string;
  description: string;
  priority: number;
  dueDateInMs: number;
  status: boolean;
}

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        taskId: { type: String },
        tittle: { type: String },
        description: { type: String },
        priority: { type: Number },
        dueDateInMs: { type: Number },
        status: { type: Boolean },
      },
    ],
  })
  tasks: ITask[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
