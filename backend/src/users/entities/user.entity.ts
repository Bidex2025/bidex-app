import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auction } from '../../auctions/entities/auction.entity'; // Corrected path
import { Bid } from '../../bids/entities/bid.entity'; // Corrected path

export enum UserType {
  CLIENT = 'client',
  SUPPLIER = 'supplier',
}

@Entity('users') // Specify the table name
export class User {
  @PrimaryGeneratedColumn('uuid') // Use UUID for primary key
  user_id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  user_type: UserType;

  @Column({ type: 'jsonb', nullable: true }) // Use JSONB for flexible profile info
  profile_info: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relation: User (client) can create many Auctions
  @OneToMany(() => Auction, (auction: Auction) => auction.client)
  auctions_created: Auction[];

  // Relation: User (supplier) can submit many Bids
  @OneToMany(() => Bid, (bid: Bid) => bid.supplier)
  bids_submitted: Bid[];

  // Hash password before inserting or updating
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash if password_hash is set, likely plain text, and not already a long hash
    if (this.password_hash && this.password_hash.length < 60) { 
      const saltRounds = 10;
      this.password_hash = await bcrypt.hash(this.password_hash, saltRounds);
    }
  }

  // Method to compare passwords (useful for login)
  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password_hash || !attempt) return false; // Handle case where hash or attempt might be missing
    return bcrypt.compare(attempt, this.password_hash);
  }
}

