import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../domain/model/user.model';

@Entity('users')
export class UserEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  constructor(props?: Partial<User>) {
    super(props ?? {});
  }
}
