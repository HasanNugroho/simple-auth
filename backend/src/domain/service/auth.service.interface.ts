import { Credential } from '../../presentation/user/dto/auth.dto';

/**
 * Authentication service interface.
 */
export interface IAuthService {
  /**
   * Authenticate user with identifier and password.
   * @param credential - User login input (email/username and password)
   * @returns Access and refresh tokens
   */
  login(credential: Credential): Promise<string>;
}
