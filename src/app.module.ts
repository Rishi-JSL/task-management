import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { databaseUrl } from './common/configs';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { TaskNotificationModule } from './gateway/task-notifications.module';
import { TaskReminderModule } from './reminders/reminder.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    UserModule,
    AuthModule,
    ScheduleModule.forRoot(),
    TaskNotificationModule,
    ProjectModule,
    TaskReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
