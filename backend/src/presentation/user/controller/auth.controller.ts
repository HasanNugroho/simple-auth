import {
  JsonController,
  Post,
  Body,
  Get,
  Req,
  Authorized,
} from 'routing-controllers';
import { Credential } from '../../user/dto/auth.dto';
import { AuthService } from '../../../application/service/auth.service';
import { inject, injectable } from 'tsyringe';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../../../application/service/user.service';
import { HttpResponse } from '../../../common/dto/reponse.dto';

@JsonController('/auth')
@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(UserService) private readonly userService: UserService
  ) {}

  @Post('/login')
  async login(@Body({ validate: true }) credential: Credential) {
    const token = await this.authService.login(credential);

    return new HttpResponse(true, 'Login successful', { token });
  }

  @Post('/register')
  async register(@Body({ validate: true }) user: CreateUserDto) {
    const created = await this.userService.create(user);
    return new HttpResponse(true, 'Registration successful', created);
  }

  @Get('/me')
  @Authorized()
  async profile(@Req() req: Request) {
    return new HttpResponse(true, 'Success', (req as any).user);
  }
}
