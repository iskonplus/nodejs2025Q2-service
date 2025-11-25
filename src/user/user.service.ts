import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, PublicUser } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private users: User[] = [];

  private stripPassword(user: User): PublicUser {
    const { password, ...rest } = user;
    return rest;
  }

  getAllUsers(): PublicUser[] {
    return this.users.map((user) => this.stripPassword(user));
  }
}
