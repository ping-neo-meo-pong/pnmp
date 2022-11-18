import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('pmmp')
    .setDescription('ft_transcandence')
    .setVersion('1.0.0')
    //JWT 토큰 설정
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

  // config를 바탕으로 swagger document 생성
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Swagger UI에 대한 path를 연결함
  // .setup('swagger ui endpoint', app, swagger_document)
  SwaggerModule.setup('swagger', app, swaggerDocument, swaggerCustomOptions);

  await app.listen(parseInt(process.env.BACKEND_PORT, 10) || 8000);
}
bootstrap();
