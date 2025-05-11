import { IsEmail, IsString, MinLength, IsEnum, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '../../users/entities/user.entity';

// Define a simple class for profile_info if needed, or use Record<string, any>
class ProfileInfoDto {
  @IsString()
  name: string;

  // Add other optional or required profile fields here
  @IsString()
  @IsOptional()
  company_name?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(UserType)
  user_type: UserType;

  @IsObject()
  @ValidateNested()
  @Type(() => ProfileInfoDto) // Important for nested validation
  @IsOptional() // Make profile_info optional during registration
  profile_info?: ProfileInfoDto;
}

