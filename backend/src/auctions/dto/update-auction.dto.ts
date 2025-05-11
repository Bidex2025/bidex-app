import { PartialType } from '@nestjs/mapped-types'; // Use mapped-types for convenience
import { CreateAuctionDto } from './create-auction.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AuctionStatus } from '../entities/auction.entity';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  // Inherits all fields from CreateAuctionDto as optional

  // Add specific fields for update, like status
  @IsEnum(AuctionStatus)
  @IsOptional()
  status?: AuctionStatus;
}

