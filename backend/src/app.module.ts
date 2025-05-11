import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'), // Add default value
        port: configService.get<number>('DATABASE_PORT', 5432), // Add default value
        username: configService.get<string>('DATABASE_USERNAME', 'postgres'), // Add default value
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'), // Add default value
        database: configService.get<string>('DATABASE_NAME', 'bidex_db'), // Add default value
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Correct path to auto-load entities from subdirectories
        synchronize: true, // Auto-create database schema (use migrations in production)
      }),
      inject: [ConfigService],
    }),
    UsersModule, // Import UsersModule
    AuthModule, // Import AuthModule
    AuctionsModule, // Import AuctionsModule
    BidsModule, // Import BidsModule
  ],
  controllers: [AppController], // Only AppController should be here
  providers: [AppService], // Only AppService should be here
})
export class AppModule {}

