/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Eth Gas & Uniswap API')
    .setDescription('Calculate Gas price & swap returns on UniswapV2')
    .setVersion('1.0')
    .addTag('uniswap')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('v1/api/docs', app, document);

  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🚀 API Docs is running on: http://localhost:${port}/v1/api/docs`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
