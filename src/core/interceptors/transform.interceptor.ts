import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

// этот перехватчик нужен для того, чтобы
// @Exclude({ toPlainOnly: true }) работал с UserEntity и позволяет не "светить"
// юзера при запросе на таскиы
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  public intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(instanceToPlain.bind(this)));
  }
}
