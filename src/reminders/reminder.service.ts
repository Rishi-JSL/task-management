import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TaskNotificationGateway } from 'src/gateway/task-notification.gateway';
import { ProjectService } from 'src/project/project.service';

export class TaskReminderService {
  private logger: any;
  constructor(
    private projectService: ProjectService,
    private taskNotify: TaskNotificationGateway,
  ) {
    this.logger = new Logger();
  }

  @Cron('* * * 12 * *')
  async handleCron() {
    console.log('testing');
    this.logger.log('Called when the current second is 45');

    const pendingTaskInProjectsForOwner =
      await this.projectService.getAllProjectPendingTaskOwner();

    this.taskNotify.sendReminderForPendingTask({
      message: pendingTaskInProjectsForOwner,
    });
  }
}
