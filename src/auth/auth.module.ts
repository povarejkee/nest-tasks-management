import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyService } from './services/jwt-strategy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: 'putIn', signOptions: { expiresIn: 3600 } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService],
  exports: [JwtStrategyService, PassportModule],
})
export class AuthModule {}
