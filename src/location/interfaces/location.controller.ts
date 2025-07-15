import { Controller } from '@nestjs/common';
import { LocationService } from '../use-cases/location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
}
