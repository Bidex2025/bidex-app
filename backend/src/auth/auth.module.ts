import { Module } from '@nestjs/common';
import { AuthService } from './auth.service'; // Corrected relative path
import { AuthController } from './auth.controller'; // Corrected relative path
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // Corrected relative path
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { User } from '../users/entities/user.entity'; // Corrected path to users module
// UsersService is provided by UsersModule, no need to import or provide it here directly

@Module({
  imports: [
    UsersModule, // Make UsersService available via UsersModule
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configure Passport
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d', // Token expires in 1 day
        },
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forFeature([User]), // User repository is managed within UsersModule
  ],
  providers: [AuthService, JwtStrategy], // Provide AuthService and JwtStrategy
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, JwtModule] // Export for use in other modules if needed
})
export class AuthModule {}

