import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway()
export class TaskNotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('client connected:', socket.id);
    });
  }
  sendNotificationForTask(data: { message: string }) {
    this.server.emit('taskNotification', data);
  }
  sendReminderForPendingTask(data: { message: any }) {
    this.server.emit('pendingTaskReminder', data);
  }
  @SubscribeMessage('groupChat')
  notificationHandler(@MessageBody() body: unknown) {
    console.log(body);
  }
}
