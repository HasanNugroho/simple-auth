import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/model/user.model';
import { IUserRepository } from '../../domain/repository/user.repository.interface';
import { plainToInstance } from 'class-transformer';
import { HttpError } from 'routing-controllers';
import { autoInjectable } from 'tsyringe';
import { connectionSource } from '../configs/data-source';

@autoInjectable()
export class UserRepository implements IUserRepository {
  private db: Repository<UserEntity>;

  constructor() {
    this.db = connectionSource.getRepository(UserEntity);
  }

  async create(user: User): Promise<User> {
    try {
      const userEntity = await this.db.save(user as any);
      return this.toUser(userEntity);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpError(409, 'User already exists');
      }
      throw new HttpError(500, 'Database error');
    }
  }

  async getById(id: string): Promise<User | null> {
    const userEntity = await this.db.findOne({ where: { id } });
    return userEntity ? this.toUser(userEntity) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const userEntity = await this.db.findOne({ where: { email } });
    return userEntity ? this.toUser(userEntity) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.db.findOne({ where: { id } });
    if (!existingUser) throw new HttpError(404, 'User not found');

    try {
      const updated = await this.db.save({ ...existingUser, ...userData });
      return this.toUser(updated);
    } catch (error) {
      throw new HttpError(500, 'Failed to update user');
    }
  }

  private toUser(userEntity: UserEntity): User {
    return new User({
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
    });
  }
}
