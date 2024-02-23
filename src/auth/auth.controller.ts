import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { IJwtToken } from './interfaces/IJwtToken';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('/test')
  @UseGuards(AuthGuard())
  public testingJwt(@Req() req: Request): void {
    console.log(req);
  }
}
