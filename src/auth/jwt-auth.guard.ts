import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { httpErrors } from 'src/handleErrors/http-errors';

type JwtPayload = {
  userId: string;
  login: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const url = req.url;

    if (
      url === '/' ||
      url.startsWith('/doc') ||
      url.startsWith('/auth/signup') ||
      url.startsWith('/auth/login') ||
      url.startsWith('/auth/refresh')
    ) {
      return true;
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw httpErrors.unauthorized('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw httpErrors.unauthorized('Invalid authorization header');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      (req as any).user = payload;

      return true;
    } catch {
      throw httpErrors.unauthorized('Invalid or expired token');
    }
  }
}
