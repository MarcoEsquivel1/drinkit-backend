import { User } from '../../infrastructure/database/entities/user.entity';

export interface UserAuthRepository {
  findByCredentials(username?: string, email?: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findBySocialId(
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<User | null>;
  findByEmailOrSocialId(
    email: string,
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  updateLoginStatus(userId: number, isLoggedIn: boolean): Promise<void>;
  updateVerificationStatus(email: string, isVerified: boolean): Promise<void>;
  linkSocialAccount(
    userId: number,
    socialId: string,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<void>;
  unlinkSocialAccount(
    userId: number,
    provider: 'google' | 'facebook' | 'apple',
  ): Promise<void>;
  updateSocialAccountData(userId: number, email?: string): Promise<void>;
}
