import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { CustomValidationPipe } from '@/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new CustomValidationPipe()); // use validation pipe globally
  app.setGlobalPrefix('api');
  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
