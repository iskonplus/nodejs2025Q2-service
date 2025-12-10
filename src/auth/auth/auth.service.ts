import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { httpErrors } from 'src/handleErrors/http-errors';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const { login, password } = dto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        login,
        password: hashedPassword,
        version: 1,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      },
    });

    return { message: 'User created', id: user.id };
  }

  async login(dto: LoginDto) {
    const { login, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { login } });
    if (!user) throw httpErrors.forbidden('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw httpErrors.forbidden('Password is wrong');

    return { message: 'Login successful (tokens will be here!)' };
  }
}
