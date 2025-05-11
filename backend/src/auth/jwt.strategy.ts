import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // Corrected path to users module
import { User, UserType } from '../users/entities/user.entity'; // Corrected path to users module

// Define the structure of the JWT payload
interface JwtPayload {
  email: string;
  sub: string; // User ID (user_id)
  type: UserType; // User Type
  iat?: number; // Issued at (added by jwt.sign)
  exp?: number; // Expiration time (added by jwt.sign)
}

// Define the structure of the user object attached to the request
interface RequestUser {
  userId: string;
  email: string;
  type: UserType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // Inject UsersService to verify user existence
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization: Bearer <token>
      ignoreExpiration: false, // Ensure token is not expired
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use the secret from .env
    });
  }

  // This method is called by Passport after verifying the JWT signature and expiration
  async validate(payload: JwtPayload): Promise<RequestUser> {
    // We trust the payload's content (sub, email, type) because the signature was verified.
    // Optionally, we could fetch the user from the DB to ensure they still exist or haven't been deactivated.
    // const user = await this.usersService.findOneById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }

    // Return the essential user information to be attached to req.user
    return { userId: payload.sub, email: payload.email, type: payload.type };
  }
}

