import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/IJwtPayload';
import { IJwtToken } from './interfaces/IJwtToken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async createUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<void> {
    const { username, password }: UserCredentialsDto = userCredentialsDto;
    const hashedPassword: string = await this.hashPassword(password);

    const newUser: UserEntity = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      // todo вынести код ошибки в отдельное место:
      const alreadyExists: boolean = error.code === '23505';

      if (alreadyExists) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // todo fix bug with else, refactoring
  public async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<IJwtToken> {
    const { username, password }: UserCredentialsDto = userCredentialsDto;
    const user: UserEntity = await this.usersRepository.findOne({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = { username };

      // создаем токен и отдаем фронту:
      const accessToken: string = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // todo вынести в core-часть:
  private async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
