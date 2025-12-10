import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtTokenModule } from './jwt.module';

const ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN) || 60 * 15;

@Module({
  imports: [
    PrismaModule,
    JwtTokenModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
      signOptions: {
        expiresIn: ACCESS_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
