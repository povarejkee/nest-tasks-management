import { Injectable } from '@nestjs/common';
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

  public createUser(userCredentialsDto: UserCredentialsDto): void {
    const { username, password }: UserCredentialsDto = userCredentialsDto;

    const newUser: UserEntity = this.usersRepository.create({
      username,
      password,
    });

    this.usersRepository.save(newUser);
  }
}
