import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '@/dto/request.dto';

export const CurrentUser = createParamDecorator(
  (key: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    if (!user) {
      return null;
    }

    if (key) {
      return user[key];
    }

    return user;
  },
);
