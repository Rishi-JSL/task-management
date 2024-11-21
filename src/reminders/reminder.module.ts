import { Module } from '@nestjs/common';
import { TaskReminderService } from './reminder.service';
import { ProjectModule } from 'src/project/project.module';
import { TaskNotificationModule } from 'src/gateway/task-notifications.module';

@Module({
  imports: [ProjectModule, TaskNotificationModule],
  providers: [TaskReminderService],
})
export class TaskReminderModule {}
