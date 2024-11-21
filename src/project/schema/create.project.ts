import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

export interface ITask {
  taskId: string;
  tittle: string;
  description: string;
  priority: number;
  dueDate: Date;
}

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({
    type: [
      {
        taskId: { type: String },
        tittle: { type: String },
        description: { type: String },
        priority: { type: Number },
        dueDate: { type: Date },
      },
    ],
  })
  tasks: ITask[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  collaborators: Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
