import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum UserRoleType {
  SUPER_ADMIN = 'superAdmin', // Owner(Highest-level access), including managing other admins
  ADMIN = 'admin', // Full access
  EDITOR = 'editor', // Create and update
  VIEWER = 'viewer', // Read-only
}
@Schema()
export class UserRole {
  @Prop({ type: String, required: true, index: true })
  projectId: string;
  @Prop({ type: String, required: true, index: true })
  userEmail: string;
  @Prop({ type: String, required: true })
  role: UserRoleType;
}
export const UserRoleModel = SchemaFactory.createForClass(UserRole);
