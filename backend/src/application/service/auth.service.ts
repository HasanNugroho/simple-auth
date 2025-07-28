import { Credential } from '../../presentation/user/dto/auth.dto';
import { IAuthService } from '../../domain/service/auth.service.interface';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { inject, injectable } from 'tsyringe';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '../../common/exceptions';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async login(credential: Credential): Promise<string> {
    const { email, password } = credential;

    try {
      const user = await this.userRepository.getByEmail(email);

      if (!user || !bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException('Invalid identifier or password');
      }

      return this.generateTokens(user.id);
    } catch (error) {
      throw error;
    }
  }

  private async generateTokens(id: string): Promise<string> {
    const payload = { id };

    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
  }
}
