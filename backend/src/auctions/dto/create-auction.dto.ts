import { IsString, IsEnum, IsOptional, IsNumber, IsDateString, IsObject, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionType, AuctionStatus } from '../entities/auction.entity';

// Define a class for the 'details' object if you have a specific structure
// Otherwise, Record<string, any> can be used, but validation is limited.
// Example for a more structured 'details':
class AuctionDetailsDto {
  // Add specific fields expected within the details JSON
  // e.g., @IsString() @IsOptional() location?: string;
  // For now, allow any structure
}

export class CreateAuctionDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsEnum(AuctionType)
  auction_type: AuctionType;

  @IsObject()
  @IsOptional()
  // @ValidateNested() // Enable if AuctionDetailsDto is defined and needs validation
  // @Type(() => AuctionDetailsDto) // Enable if AuctionDetailsDto is defined
  details?: Record<string, any>; // Flexible details field

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string; // Use ISO 8601 date string format
}

