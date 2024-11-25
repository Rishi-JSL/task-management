import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskNotificationModule } from 'src/gateway/task-notifications.module';
import { UserRole, UserRoleSchema } from 'src/role/schema/user-role.schema';
import { UserModule } from 'src/user/user.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './schema/create.project';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    UserModule,
    TaskNotificationModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
