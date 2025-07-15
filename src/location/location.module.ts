import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country, State, City } from './infrastructure/database/entities';
import { LocationController } from './interfaces/location.controller';
import { LocationService } from './use-cases/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, State, City])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
