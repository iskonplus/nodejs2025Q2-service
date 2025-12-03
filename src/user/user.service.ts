import { Injectable } from '@nestjs/common';
import { User, PublicUser } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';
import { httpErrors } from '../handleErrors/http-errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  // private users: User[] = [
  //   {
  //     login: 'test-1',
  //     password: '111',
  //     id: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
  //     version: 1,
  //     createdAt: 122121212121,
  //     updatedAt: 0,
  //   },
  // ];
  constructor(private readonly prisma: PrismaService) {}

  private stripPassword(user: User): PublicUser {
    const { password, ...rest } = user;
    return rest;
  }

  private now = () => Math.floor(Date.now() / 1000);

  async getAllUsers(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.stripPassword(user));
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw httpErrors.notFound('User not found');
    return this.stripPassword(user);
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const newUser: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: this.now(),
      updatedAt: this.now(),
    };

    await this.prisma.user.create({ data: newUser });
    return this.stripPassword(newUser);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw httpErrors.notFound('User not found');

    if (user.password !== dto.oldPassword) {
      throw httpErrors.forbidden('Old password is wrong');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        version: user.version + 1,
        updatedAt: this.now(),
      },
    });

    return this.stripPassword(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw httpErrors.notFound('User not found');
    await this.prisma.user.delete({ where: { id } });
  }
}
