import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './api/role/role.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './api/auth/auth.module';
import { DmModule } from './api/dm/dm.module';
import { EventsModule } from './events/events.module';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [
    EventsModule,
    AuthModule,
    DmModule,
    RoleModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_CONTAINER_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + '/core/**/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities: true,
      // logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
