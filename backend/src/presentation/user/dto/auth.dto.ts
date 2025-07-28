import 'reflect-metadata';

import { IsEmail, IsString } from 'class-validator';

export class Credential {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
