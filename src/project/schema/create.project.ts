import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

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

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  collaborators: User[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
