import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Corrected path
import { Bid } from '../../bids/entities/bid.entity'; // Import Bid

export enum AuctionType {
  PROFESSIONAL = 'professional',
  QUICK = 'quick',
}

export enum AuctionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  AWARDED = 'awarded',
  CANCELLED = 'cancelled',
}

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  auction_id: string;

  // Use the actual column name for the foreign key
  @Column({ type: 'uuid' })
  client_user_id: string;

  // Define the relationship with User (Client)
  @ManyToOne(() => User, user => user.auctions_created)
  @JoinColumn({ name: 'client_user_id' }) // Specify the foreign key column name
  client: User;

  @Column({ type: 'enum', enum: AuctionType })
  auction_type: AuctionType;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb', nullable: true }) // For professional auction requirements, quick bid images, etc.
  details: Record<string, any>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deadline: Date;

  @Column({ type: 'enum', enum: AuctionStatus, default: AuctionStatus.OPEN })
  status: AuctionStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relation to Bids: An auction can have many bids
  @OneToMany(() => Bid, bid => bid.auction)
  bids: Bid[];
}

