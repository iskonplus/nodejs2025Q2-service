import { Injectable } from '@nestjs/common';
import { User, PublicUser } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';
import { httpErrors } from '../handleErrors/http-errors';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      login: 'test-1',
      password: '111',
      id: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
      version: 1,
      createdAt: 122121212121,
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

    if (!user) throw httpErrors.notFound('User not found');
    return this.stripPassword(user);
  }

  create(dto: CreateUserDto): PublicUser {
    const now = Date.now();

    const newUser: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);

    return this.stripPassword(newUser);
  }

  updatePassword(id: string, dto: UpdatePasswordDto): PublicUser {
    const user = this.users.find((u) => u.id === id);

    if (!user) throw httpErrors.notFound('User not found');

    if (user.password !== dto.oldPassword) {
      throw httpErrors.forbidden('Old password is wrong');
    }

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.stripPassword(user);
  }

  deleteUser(id: string): void {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) throw httpErrors.notFound('User not found');
    this.users.splice(userIndex, 1);
  }
}
