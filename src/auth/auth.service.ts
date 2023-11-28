import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  public async createUser(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<void> {
    const { username, password }: UserCredentialsDto = userCredentialsDto;

    const newUser: UserEntity = this.usersRepository.create({
      username,
      password,
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
}
