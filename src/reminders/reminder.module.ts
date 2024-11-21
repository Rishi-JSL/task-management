import { Module } from '@nestjs/common';
import { TaskReminderService } from './reminder.service';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [ProjectModule],
  providers: [TaskReminderService],
})
export class TaskReminderModule {}
