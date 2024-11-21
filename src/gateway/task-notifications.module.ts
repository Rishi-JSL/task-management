import { Module } from '@nestjs/common';
import { TaskNotificationGateway } from './task-notification.gateway';

@Module({
  providers: [TaskNotificationGateway],
  exports: [TaskNotificationGateway],
})
export class TaskNotificationModule {}
