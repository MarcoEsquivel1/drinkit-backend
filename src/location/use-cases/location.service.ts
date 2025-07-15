import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, State, City } from '../infrastructure/database/entities';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}
}
