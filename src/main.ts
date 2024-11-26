import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestResponseLogger } from './interceptor/ReqResponseLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new RequestResponseLogger());
  app.enableCors();
  const PORT = process.env.PORT as string;
  await app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

bootstrap();
