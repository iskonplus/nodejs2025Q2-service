import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { httpErrors } from 'src/handleErrors/http-errors';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { login, password } = dto;

    const existing = await this.prisma.user.findUnique({ where: { login } });
    if (existing) {
      throw httpErrors.forbidden('User already exists');
    }

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

    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
