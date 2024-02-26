import { Body, Controller, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { IJwtToken } from './interfaces/IJwtToken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  public signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<void> {
    return this.authService.createUser(userCredentialsDto);
  }

  @Post('/signin')
  public signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<IJwtToken> {
    return this.authService.signIn(userCredentialsDto);
  }
}
