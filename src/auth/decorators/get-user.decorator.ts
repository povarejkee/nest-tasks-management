import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user.entity';

// todo types:
export const GetUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
