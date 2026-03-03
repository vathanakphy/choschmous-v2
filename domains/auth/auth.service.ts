// domains/auth/auth.service.ts
import { AuthRepository } from './auth.repository';
import type { LoginInput, AuthUser } from './auth.types';
import { loginSchema } from './auth.validators';
import { UnauthorizedError } from '@/lib/api/errors';
import { backendRoleToFrontendRole } from './auth.types';

export class AuthService {
  constructor(private repo: AuthRepository) { }

  async login(input: LoginInput): Promise<AuthUser> {
    const parsed = loginSchema.parse(input);

    let result;
    try {
      result = await this.repo.login(parsed);
    } catch (err) {
      // FIX: Log the real error for debugging — swallowing it made failures invisible
      console.error('[AuthService.login]', err);
      throw new UnauthorizedError();
    }

    if (!result?.user) throw new UnauthorizedError();

    const { user } = result;

    return {
      id: String(user.id),
      email: user.email,
      username: user.username,
      role: backendRoleToFrontendRole(user.role, user.is_superuser),
      name: `${user.en_given_name} ${user.en_family_name}`.trim(),
    };
  }
}