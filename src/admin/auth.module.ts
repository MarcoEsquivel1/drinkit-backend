import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

// Entities
import { Admin } from './infrastructure/database/entities/admin.entity';
import { User } from '../user/infrastructure/database/entities/user.entity';

// Events
import { VerifyAccessEvent } from './domain/events/verify-access.event';

// Strategies
import {
  CredentialsStrategy,
  JwtStrategy,
  ApiKeyStrategy,
  SecureCustomerStrategy,
} from './infrastructure/auth/strategies';

// Guards
import {
  CredentialsGuard,
  JwtGuard,
  ApiKeyGuard,
  SecureCustomerGuard,
} from './infrastructure/auth/guards';

// Services
import { AuthService } from './use-cases/auth/auth.service';

// Controllers
import { AuthController } from './interfaces/auth/auth.controller';

// Shared
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    SharedModule,
  ],
  providers: [
    // Events
    VerifyAccessEvent,

    // Strategies
    CredentialsStrategy,
    JwtStrategy,
    ApiKeyStrategy,
    SecureCustomerStrategy,

    // Guards
    CredentialsGuard,
    JwtGuard,
    ApiKeyGuard,
    SecureCustomerGuard,

    // Services
    AuthService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    VerifyAccessEvent,
    CredentialsGuard,
    JwtGuard,
    ApiKeyGuard,
    SecureCustomerGuard,
  ],
})
export class AuthModule {}
