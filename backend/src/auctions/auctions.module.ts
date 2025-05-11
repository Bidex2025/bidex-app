import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service'; // Corrected relative path
import { AuctionsController } from './auctions.controller'; // Corrected relative path
import { Auction } from './entities/auction.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for JWT Guard
import { UsersModule } from '../users/users.module'; // Import UsersModule to provide UsersService

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction]), // Make Auction repository available
    AuthModule, // Import AuthModule to use JwtAuthGuard
    UsersModule, // Import UsersModule to make UsersService available for injection
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService] // Export AuctionsService so it can be injected into BidsService
})
export class AuctionsModule {}

