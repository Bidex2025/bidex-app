import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Corrected path to users module
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto'; // Corrected relative path
import { LoginDto } from './dto/login.dto'; // Corrected relative path
import { User } from '../users/entities/user.entity'; // Corrected path to users module

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash' | 'comparePassword' | 'hashPassword'>> {
    try {
      // UsersService.create now returns Omit<User, 'password_hash'>
      const user = await this.usersService.create(createUserDto);
      // Type assertion might be needed if the return type isn't exactly matching
      return user as Omit<User, 'password_hash' | 'comparePassword' | 'hashPassword'>;
    } catch (error) {
      if (error instanceof ConflictException) {
        // Use the specific message from UsersService or a generic one
        throw new ConflictException('البريد الإلكتروني مسجل بالفعل');
      }
      throw error; // Re-throw other errors
    }
  }

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password_hash' | 'comparePassword' | 'hashPassword'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    // Check if user exists and password matches
    if (user && await user.comparePassword(pass)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, comparePassword, hashPassword, ...result } = user; // Remove password hash and methods
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    // Payload includes user ID (sub), email, and user type
    const payload = { email: user.email, sub: user.user_id, type: user.user_type };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

