import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { ProductModule } from './product/product.module';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { PromotionModule } from './promotion/promotion.module';
import { getRedisConfig } from './shared/infrastructure/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getRedisConfig,
      inject: [ConfigService],
      isGlobal: true,
    }),
    DatabaseModule,
    SharedModule,
    LocationModule,
    UserModule,
    AdminModule,
    ProductModule,
    OrderModule,
    PromotionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
