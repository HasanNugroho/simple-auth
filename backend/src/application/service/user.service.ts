import { Credential } from '../../presentation/user/dto/auth.dto';
import { User } from '../../domain/model/user.model';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { IUserService } from '../../domain/service/user.service.interface';
import { CreateUserDto } from '../../presentation/user/dto/create-user.dto';
import { inject, injectable } from 'tsyringe';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '../../common/exceptions';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const userExist = await this.userRepository.getByEmail(userData.email);
      if (userExist) {
        throw new BadRequestException('Email telah digunakan');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      });

      return await this.userRepository.create(user);
    } catch (error) {
      throw error;
    }
  }
}
