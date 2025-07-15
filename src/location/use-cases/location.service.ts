import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, State, City } from '../infrastructure/database/entities';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CreateStateDto,
  UpdateStateDto,
  CreateCityDto,
  UpdateCityDto,
} from '../interfaces/dtos';

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

  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepository.create({
      ...createCountryDto,
      createdBy: 'system',
    });
    return this.countryRepository.save(country);
  }

  async findAllCountries(): Promise<Country[]> {
    return this.countryRepository.find({
      relations: ['states'],
      order: { name: 'ASC' },
    });
  }

  async findOneCountry(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['states'],
    });

    if (!country) {
      throw new NotFoundException(`País con ID ${id} no encontrado`);
    }

    return country;
  }

  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.findOneCountry(id);

    Object.assign(country, {
      ...updateCountryDto,
      updatedBy: 'system',
    });

    return this.countryRepository.save(country);
  }

  async removeCountry(id: string): Promise<void> {
    const country = await this.findOneCountry(id);
    await this.countryRepository.softRemove(country);
  }

  async createState(createStateDto: CreateStateDto): Promise<State> {
    await this.findOneCountry(createStateDto.countryId.toString());

    const state = this.stateRepository.create({
      ...createStateDto,
      createdBy: 'system',
    });
    return this.stateRepository.save(state);
  }

  async findAllStates(): Promise<State[]> {
    return this.stateRepository.find({
      relations: ['country', 'cities'],
      order: { name: 'ASC' },
    });
  }

  async findStatesByCountry(countryId: string): Promise<State[]> {
    await this.findOneCountry(countryId);
    return this.stateRepository.find({
      where: { countryId: parseInt(countryId) },
      relations: ['cities'],
      order: { name: 'ASC' },
    });
  }

  async findOneState(id: string): Promise<State> {
    const state = await this.stateRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['country', 'cities'],
    });

    if (!state) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }

    return state;
  }

  async updateState(
    id: string,
    updateStateDto: UpdateStateDto,
  ): Promise<State> {
    const state = await this.findOneState(id);

    if (updateStateDto.countryId) {
      await this.findOneCountry(updateStateDto.countryId.toString());
    }

    Object.assign(state, {
      ...updateStateDto,
      updatedBy: 'system',
    });

    return this.stateRepository.save(state);
  }

  async removeState(id: string): Promise<void> {
    const state = await this.findOneState(id);
    await this.stateRepository.softRemove(state);
  }

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    await this.findOneState(createCityDto.stateId.toString());

    const city = this.cityRepository.create({
      ...createCityDto,
      createdBy: 'system',
    });
    return this.cityRepository.save(city);
  }

  async findAllCities(): Promise<City[]> {
    return this.cityRepository.find({
      relations: ['state', 'state.country'],
      order: { name: 'ASC' },
    });
  }

  async findCitiesByState(stateId: string): Promise<City[]> {
    await this.findOneState(stateId);
    return this.cityRepository.find({
      where: { stateId: parseInt(stateId) },
      relations: ['state'],
      order: { name: 'ASC' },
    });
  }

  async findOneCity(id: string): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['state', 'state.country'],
    });

    if (!city) {
      throw new NotFoundException(`Ciudad con ID ${id} no encontrada`);
    }

    return city;
  }

  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findOneCity(id);

    if (updateCityDto.stateId) {
      await this.findOneState(updateCityDto.stateId.toString());
    }

    Object.assign(city, {
      ...updateCityDto,
      updatedBy: 'system',
    });

    return this.cityRepository.save(city);
  }

  async removeCity(id: string): Promise<void> {
    const city = await this.findOneCity(id);
    await this.cityRepository.softRemove(city);
  }
}
