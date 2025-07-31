import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from '../../common/modules/auth/authentication/authentication.service';
import { Doc } from 'src/utils/documentation/doc';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('Public/Auth')
@Controller('public/auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Doc({
    name: 'Sign Up',
  })
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Doc({
    name: 'Sign In',
  })
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
}
