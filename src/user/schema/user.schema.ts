import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
