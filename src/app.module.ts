import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './organization/organization.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.DATA_BASE_URL + '/' + process.env.DB_NAME,
    ),
    //  MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => ({
    //     uri: `${config.get('DATA_BASE_URL')}/${config.get('DB_NAME')}?tls=true&authSource=admin&replicaSet=zen-dps-db-staging`,
    //   }),
    //   inject: [ConfigService],
    // }),

    UsersModule,
    OrganizationModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
