import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  AppleFallback,
  Blacklist,
} from './infrastructure/database/entities';
import { UserAuthController } from './interfaces/user-auth.controller';
import { UserAuthService } from './use-cases/user-auth.service';
import { UserAuthDomainService } from './domain/services/user-auth.domain.service';
import {
  GoogleStrategy,
  FacebookStrategy,
  AppleStrategy,
} from './infrastructure/auth/strategies';
import {
  UserAuthRepositoryImpl,
  BlacklistRepositoryImpl,
  AppleFallbackRepositoryImpl,
} from './infrastructure/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AppleFallback, Blacklist]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'google-customer' }),
  ],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    UserAuthDomainService,
    // Estrategias de autenticación social
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
    // Implementaciones de repositorios
    UserAuthRepositoryImpl,
    BlacklistRepositoryImpl,
    AppleFallbackRepositoryImpl,
  ],
  exports: [
    UserAuthService,
    UserAuthDomainService,
    UserAuthRepositoryImpl,
    BlacklistRepositoryImpl,
    AppleFallbackRepositoryImpl,
  ],
})
export class UserAuthModule {}
