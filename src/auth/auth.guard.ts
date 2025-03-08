import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY, IS_CUSTOMER_KEY, IS_PUBLIC_KEY } from '../decorators/is-roles.decorator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthGuard implements CanActivate {
  private publicKey: string;

  constructor(private jwtService: JwtService, private reflector: Reflector) {
    this.publicKey = fs.readFileSync(path.resolve('keys/public.pem'), 'utf8');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { publicKey: this.publicKey }); // ✅ FIXED
      request['user'] = payload; // Attach user data to request

      // Role-based access control
      const isAdminRequired = this.reflector.get<boolean>(IS_ADMIN_KEY, context.getHandler());
      const isCustomerRequired = this.reflector.get<boolean>(IS_CUSTOMER_KEY, context.getHandler());

      if (isAdminRequired && !payload?.isAdmin) {
        throw new ForbiddenException('Admin access required');
      }

      if (isCustomerRequired && payload?.isAdmin) {
        throw new ForbiddenException('Customers only');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error; // Re-throw to preserve proper status
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
