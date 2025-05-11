import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBidDto extends PartialType(CreateBidDto) {
  @IsOptional()
  @IsString()
  status?: string; // Example: 'accepted', 'rejected'
}

