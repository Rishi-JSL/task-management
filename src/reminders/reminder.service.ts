import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from 'src/project/project.service';

export class TaskReminderService {
  private logger: any;
  constructor(private projectService: ProjectService) {
    this.logger = new Logger();
  }

  @Cron('45 * * * * *')
  handleCron() {
    console.log('testing');
    this.logger.log('Called when the current second is 45');
  }
}
