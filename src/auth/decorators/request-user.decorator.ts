import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserFromJwt } from '../interfaces/jwt-payload.interface';

export const RequestUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserFromJwt;
  },
);
