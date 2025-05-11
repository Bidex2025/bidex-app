import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
// UsersController is not needed for this module as it's handled by AuthController

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Make User repository available
  providers: [UsersService], // Provide UsersService within this module
  exports: [UsersService], // Export UsersService so other modules can import UsersModule and use UsersService
})
export class UsersModule {}

