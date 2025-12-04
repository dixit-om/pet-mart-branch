import { NestFactory } from '@nestjs/core';
import { AppsModule } from './apps.module';

async function bootstrap() {
  const app = await NestFactory.create(AppsModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
