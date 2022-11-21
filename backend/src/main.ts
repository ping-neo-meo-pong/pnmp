import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //   cors 및 cookie 설정
  //   app.enableCors({
  //     origin: ['http://localhost'],
  //     credentials: true,
  //   });

  // cookie 설정
  app.use(cookieParser());

  // swagger
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('pmmp')
    .setDescription('ft_transcandence')
    .setVersion('1.0.0')
    .addServer('api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: true,
  };

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocumentOptions,
  );

  SwaggerModule.setup('swagger', app, swaggerDocument, swaggerCustomOptions);

  await app.listen(parseInt(process.env.BACKEND_PORT, 10) || 8000);
}
bootstrap();
