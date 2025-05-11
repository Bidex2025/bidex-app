import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction, AuctionStatus } from './entities/auction.entity'; // Corrected relative path
import { CreateAuctionDto } from './dto/create-auction.dto'; // Corrected relative path
import { UpdateAuctionDto } from './dto/update-auction.dto'; // Corrected relative path
import { User, UserType } from '../users/entities/user.entity'; // Corrected path to users module
import { UsersService } from '../users/users.service'; // Corrected path to users module

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionsRepository: Repository<Auction>,
    // Inject UsersService to find user entities
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  // Helper to find user by ID (needed by BidsService)
  async findUserById(userId: string): Promise<User | null> {
    return this.usersService.findOneById(userId);
  }

  // userFromJwt comes from JwtStrategy { userId: string; email: string; type: UserType }
  async create(createAuctionDto: CreateAuctionDto, userFromJwt: { userId: string; email: string; type: UserType }): Promise<Auction> {
    // Find the full client user entity
    const clientUser = await this.findUserById(userFromJwt.userId);
    if (!clientUser) {
      throw new NotFoundException(`المستخدم بالمعرف ${userFromJwt.userId} غير موجود.`);
    }
    // Ensure the user creating is a client
    if (clientUser.user_type !== UserType.CLIENT) {
        throw new ForbiddenException('فقط العملاء يمكنهم إنشاء الطلبات.');
    }

    const newAuction = this.auctionsRepository.create({
      ...createAuctionDto,
      client: clientUser, // Set the relation object
      status: AuctionStatus.OPEN, // Use enum for default status
      // client_user_id is set automatically by TypeORM based on the 'client' relation
    });
    return this.auctionsRepository.save(newAuction);
  }

  async findAll(): Promise<Auction[]> {
    // Later, add filtering, pagination, etc.
    return this.auctionsRepository.find({ 
        relations: ['client'], // Include client info
        order: { created_at: 'DESC' } // Order by creation date
    }); 
  }

  async findOne(auctionUuid: string): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({ 
        where: { auction_id: auctionUuid }, // Use UUID
        relations: ['client', 'bids', 'bids.supplier'] // Include client, bids, and bid suppliers
    });
    if (!auction) {
      throw new NotFoundException(`الطلب بالمعرف "${auctionUuid}" غير موجود`);
    }
    return auction;
  }

  // userFromJwt comes from JwtStrategy { userId: string; email: string; type: UserType }
  async update(auctionUuid: string, updateAuctionDto: UpdateAuctionDto, userFromJwt: { userId: string; email: string; type: UserType }): Promise<Auction> {
    const auction = await this.findOne(auctionUuid); // Reuse findOne to check existence and load relations

    // Authorization check: Only the client who created the auction can update it
    if (auction.client.user_id !== userFromJwt.userId) {
      throw new ForbiddenException('لست مصرحاً لك بتحديث هذا الطلب');
    }

    // Prevent updating certain fields if needed (e.g., client relation)
    // Merge the existing auction with the update DTO
    Object.assign(auction, updateAuctionDto);

    return this.auctionsRepository.save(auction);
  }

  // userFromJwt comes from JwtStrategy { userId: string; email: string; type: UserType }
  async remove(auctionUuid: string, userFromJwt: { userId: string; email: string; type: UserType }): Promise<void> {
    const auction = await this.findOne(auctionUuid); // Reuse findOne to check existence and load relations

    // Authorization check: Only the client who created the auction can delete it
    if (auction.client.user_id !== userFromJwt.userId) {
      throw new ForbiddenException('لست مصرحاً لك بحذف هذا الطلب');
    }

    const result = await this.auctionsRepository.delete(auctionUuid); // Delete by UUID
    if (result.affected === 0) {
      // This case should ideally be caught by findOne, but added for safety
      throw new NotFoundException(`الطلب بالمعرف "${auctionUuid}" غير موجود`);
    }
  }

  // Add methods later for finding auctions by client, filtering by status/type, etc.
}

