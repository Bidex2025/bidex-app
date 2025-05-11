import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe, ParseUUIDPipe, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { AuctionsService } from './auctions.service'; // Corrected relative path
import { CreateAuctionDto } from './dto/create-auction.dto'; // Corrected relative path
import { UpdateAuctionDto } from './dto/update-auction.dto'; // Corrected relative path
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Corrected path to auth module
import { UserType } from '../users/entities/user.entity'; // Corrected path to users module

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createAuctionDto: CreateAuctionDto, @Request() req) {
    // req.user is populated by JwtAuthGuard via JwtStrategy: { userId: string; email: string; type: UserType }
    const userFromJwt = req.user;
    // Add check to ensure only 'client' type users can create auctions
    if (userFromJwt.type !== UserType.CLIENT) {
        throw new ForbiddenException('فقط العملاء يمكنهم إنشاء الطلبات.');
    }
    return this.auctionsService.create(createAuctionDto, userFromJwt);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    // This endpoint is public for now, anyone can view auctions
    return this.auctionsService.findAll();
  }

  @Get(':auctionUuid') // Use UUID parameter name
  @HttpCode(HttpStatus.OK)
  findOne(@Param('auctionUuid', ParseUUIDPipe) auctionUuid: string) {
    // This endpoint is public for now
    return this.auctionsService.findOne(auctionUuid);
  }

  @Patch(':auctionUuid') // Use UUID parameter name
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @HttpCode(HttpStatus.OK)
  update(
    @Param('auctionUuid', ParseUUIDPipe) auctionUuid: string,
    @Body(ValidationPipe) updateAuctionDto: UpdateAuctionDto,
    @Request() req,
  ) {
    const userFromJwt = req.user; // { userId: string; email: string; type: UserType }
    // Service layer handles authorization check
    return this.auctionsService.update(auctionUuid, updateAuctionDto, userFromJwt);
  }

  @Delete(':auctionUuid') // Use UUID parameter name
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @HttpCode(HttpStatus.NO_CONTENT) // Standard response for successful DELETE
  remove(@Param('auctionUuid', ParseUUIDPipe) auctionUuid: string, @Request() req) {
    const userFromJwt = req.user; // { userId: string; email: string; type: UserType }
    // Service layer handles authorization check
    return this.auctionsService.remove(auctionUuid, userFromJwt);
  }
}

