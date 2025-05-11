import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './entities/user.entity'; // Corrected relative path
import { CreateUserDto } from '../auth/dto/create-user.dto'; // Corrected relative path

// Define the return type for user creation, excluding sensitive fields and methods
type CreateUserReturnType = Omit<User, 'password_hash' | 'comparePassword' | 'hashPassword'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserReturnType> {
    const { email, password, user_type, profile_info } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني موجود بالفعل');
    }

    // Create new user instance - password will be hashed by BeforeInsert hook in entity
    const user = this.usersRepository.create({
      email,
      password_hash: password, // Pass the plain password here, it will be hashed by the entity
      user_type,
      profile_info,
    });

    // Save the user to the database
    const savedUser = await this.usersRepository.save(user);

    // Return user data without the password hash and methods
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, comparePassword, hashPassword, ...result } = savedUser;
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    // TypeORM findOne returns null if not found
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(userId: string): Promise<User | null> {
    // TypeORM findOne returns null if not found
    return this.usersRepository.findOne({ where: { user_id: userId } });
  }

  // We might add other methods later, e.g., updateProfile, etc.
}

