import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Corrected path
import { Auction } from '../../auctions/entities/auction.entity'; // Corrected path

export enum BidStatus {
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  bid_id: string;

  // Foreign key column for Auction
  @Column({ type: 'uuid' })
  auction_auction_id: string;

  // Foreign key column for User (Supplier)
  @Column({ type: 'uuid' })
  supplier_user_id: string;

  // Define the relationship with Auction
  @ManyToOne(() => Auction, auction => auction.bids)
  @JoinColumn({ name: 'auction_auction_id' }) // Specify the foreign key column name
  auction: Auction;

  // Define the relationship with User (Supplier)
  @ManyToOne(() => User, user => user.bids_submitted)
  @JoinColumn({ name: 'supplier_user_id' }) // Specify the foreign key column name
  supplier: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bid_amount: number;

  @Column('text', { nullable: true })
  proposal_details: string; // Optional details or proposal text

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.SUBMITTED })
  status: BidStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}

