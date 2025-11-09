import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import {
  ValidatedTokenPayload,
  AuthenticatedRequest,
} from '../interfaces/auth.interface.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const response$ = this.authClient.send<ValidatedTokenPayload>(
        'auth.validateToken',
        { token },
      );

      const validatedPayload = await firstValueFrom(
        response$.pipe(
          timeout(5000),
          catchError((error: Error) => {
            return throwError(
              () =>
                new UnauthorizedException(
                  error.message || 'Token validation failed',
                ),
            );
          }),
        ),
      );

      if (
        !validatedPayload ||
        typeof validatedPayload.userId !== 'string' ||
        !Array.isArray(validatedPayload.roles)
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        userId: validatedPayload.userId,
        roles: validatedPayload.roles,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException('Authentication failed: ' + errorMessage);
    }
  }
}
