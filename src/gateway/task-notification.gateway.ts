import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins, but you can restrict to a specific domain like ['http://127.0.0.1:5501']
    methods: ['GET', 'POST', 'DELETE', 'PATCH'], // Allow GET and POST methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, etc.)
  },
})
export class TaskNotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('client connected:', socket.id);
    });
  }
  sendNotificationForTask(data: { message: string }) {
    console.log('task notification', data);
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
