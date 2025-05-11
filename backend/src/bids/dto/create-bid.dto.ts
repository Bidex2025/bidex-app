import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  bid_amount: number; // Renamed from amount

  @IsOptional()
  @IsString()
  proposal_details?: string; // Renamed from details

  @IsNotEmpty()
  @IsUUID()
  auction_auction_id: string; // Renamed from auctionId and changed type to string (UUID)
}

