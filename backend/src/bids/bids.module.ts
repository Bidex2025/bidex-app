import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from '../auctions/entities/auction.entity'; // Import Auction entity if needed for relations
import { User } from '../users/entities/user.entity'; // Import User entity if needed for relations
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for guards
import { AuctionsModule } from '../auctions/auctions.module'; // Import AuctionsModule if AuctionsService is needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Auction, User]), // Register entities used within this module
    AuthModule, // Make AuthModule available for guards
    AuctionsModule, // Import AuctionsModule to potentially use AuctionsService
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}

