import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export interface TypedClientProxy extends ClientProxy {
  send<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Observable<TResult>;
}
