import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //   cors 및 cookie 설정
  //   app.enableCors({
  //     origin: ['http://localhost'],
  //     credentials: true,
  //   });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 아무 decorator가 없는 속성 개체를 거른다
      forbidNonWhitelisted: true, // 예상치 못한 입력값이 있는 요청을 막음
      transform: true, // strnig으로만 받을 수 있는 Query나 Params 같은 것을 유저가 원하는 타입으로 변경해줌
    }),
  );

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
