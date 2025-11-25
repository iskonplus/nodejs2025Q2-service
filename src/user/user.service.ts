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
  private users: User[] = [
    {
      login: 'test-1',
      password: '12345',
      id: '1',
      version: 0,
      createdAt: 0,
      updatedAt: 0,
    },
    {
      login: 'test-2',
      password: '12345',
      id: '2',
      version: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  ];

  private stripPassword(user: User): PublicUser {
    const { password, ...rest } = user;
    return rest;
  }

  getAllUsers(): PublicUser[] {
    return this.users.map((user) => this.stripPassword(user));
  }

  findOne(id: string): PublicUser {
    const user = this.users.find((u) => u.id === id);

    if (!user) throw new NotFoundException('User not found');
    return this.stripPassword(user);
  }
}
