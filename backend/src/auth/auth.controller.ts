import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; // Corrected relative path
import { CreateUserDto } from './dto/create-user.dto'; // Corrected relative path
import { LoginDto } from './dto/login.dto'; // Corrected relative path

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Set response code to 201 Created
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    // The service already handles potential conflicts (email exists)
    const user = await this.authService.register(createUserDto);
    // Return user info (without password hash)
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Set response code to 200 OK
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    // The service handles validation and returns the JWT token
    return this.authService.login(loginDto);
  }

  // We might add endpoints later for password reset, email verification, etc.
}

