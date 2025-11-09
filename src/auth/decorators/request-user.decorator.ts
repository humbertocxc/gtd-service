import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type {
  RequestUser as IRequestUser,
  AuthenticatedRequest,
} from '../interfaces/auth.interface.js';

export const RequestUser = createParamDecorator(
  (data: keyof IRequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
