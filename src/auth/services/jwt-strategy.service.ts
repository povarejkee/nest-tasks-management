import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { IJwtPayload } from '../interfaces/IJwtPayload';

// этот сервис при каждом запросе смотрит на jwt-токен, который
// отсылает клиент, и если все ок -- пропускает дальше, возвращая сущность текущего юзера,
// с которого шел запрос (как раз то, что нужно для работы декоратора GetUser):
@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: 'putIn', // todo make a global const for secret
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate(payload: IJwtPayload): Promise<UserEntity> {
    const { username }: IJwtPayload = payload;
    const user: Promise<UserEntity> = this.userRepository.findOne({
      where: { username },
    });

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
