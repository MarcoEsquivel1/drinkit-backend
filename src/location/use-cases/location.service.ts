import { Injectable } from '@nestjs/common';
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
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class LocationService extends BaseService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {
    super();
  }

  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    try {
      const country = this.countryRepository.create({
        ...createCountryDto,
        createdBy: 'system',
      });
      const savedCountry = await this.countryRepository.save(country);
      this.logInfo('País creado exitosamente', { id: savedCountry.id });
      return savedCountry;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear país');
    }
  }

  async findAllCountries(): Promise<Country[]> {
    try {
      const countries = await this.countryRepository.find({
        relations: ['states'],
        order: { name: 'ASC' },
      });
      this.logInfo(`Se encontraron ${countries.length} países`);
      return countries;
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener países');
    }
  }

  async findOneCountry(id: string): Promise<Country> {
    try {
      const country = await this.countryRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['states'],
      });

      if (!country) {
        this.createNotFoundError('País', id);
      }

      return country;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener país con ID ${id}`);
    }
  }

  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    try {
      const country = await this.findOneCountry(id);

      Object.assign(country, {
        ...updateCountryDto,
        updatedBy: 'system',
      });

      const updatedCountry = await this.countryRepository.save(country);
      this.logInfo('País actualizado exitosamente', { id: updatedCountry.id });
      return updatedCountry;
    } catch (error) {
      this.handleServiceError(error, `Error al actualizar país con ID ${id}`);
    }
  }

  async removeCountry(id: string): Promise<void> {
    try {
      const country = await this.findOneCountry(id);
      await this.countryRepository.softRemove(country);
      this.logInfo('País eliminado exitosamente', { id });
    } catch (error) {
      this.handleServiceError(error, `Error al eliminar país con ID ${id}`);
    }
  }

  async createState(createStateDto: CreateStateDto): Promise<State> {
    try {
      await this.findOneCountry(createStateDto.countryId.toString());

      const state = this.stateRepository.create({
        ...createStateDto,
        createdBy: 'system',
      });
      const savedState = await this.stateRepository.save(state);
      this.logInfo('Estado creado exitosamente', { id: savedState.id });
      return savedState;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear estado');
    }
  }

  async findAllStates(): Promise<State[]> {
    try {
      const states = await this.stateRepository.find({
        relations: ['country', 'cities'],
        order: { name: 'ASC' },
      });
      this.logInfo(`Se encontraron ${states.length} estados`);
      return states;
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener estados');
    }
  }

  async findStatesByCountry(countryId: string): Promise<State[]> {
    try {
      await this.findOneCountry(countryId);
      const states = await this.stateRepository.find({
        where: { countryId: parseInt(countryId) },
        relations: ['cities'],
        order: { name: 'ASC' },
      });
      this.logInfo(
        `Se encontraron ${states.length} estados para el país ${countryId}`,
      );
      return states;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener estados del país ${countryId}`,
      );
    }
  }

  async findOneState(id: string): Promise<State> {
    try {
      const state = await this.stateRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['country', 'cities'],
      });

      if (!state) {
        this.createNotFoundError('Estado', id);
      }

      return state;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener estado con ID ${id}`);
    }
  }

  async updateState(
    id: string,
    updateStateDto: UpdateStateDto,
  ): Promise<State> {
    try {
      const state = await this.findOneState(id);

      if (updateStateDto.countryId) {
        await this.findOneCountry(updateStateDto.countryId.toString());
      }

      Object.assign(state, {
        ...updateStateDto,
        updatedBy: 'system',
      });

      const updatedState = await this.stateRepository.save(state);
      this.logInfo('Estado actualizado exitosamente', { id: updatedState.id });
      return updatedState;
    } catch (error) {
      this.handleServiceError(error, `Error al actualizar estado con ID ${id}`);
    }
  }

  async removeState(id: string): Promise<void> {
    try {
      const state = await this.findOneState(id);
      await this.stateRepository.softRemove(state);
      this.logInfo('Estado eliminado exitosamente', { id });
    } catch (error) {
      this.handleServiceError(error, `Error al eliminar estado con ID ${id}`);
    }
  }

  async createCity(createCityDto: CreateCityDto): Promise<City> {
    try {
      await this.findOneState(createCityDto.stateId.toString());

      const city = this.cityRepository.create({
        ...createCityDto,
        createdBy: 'system',
      });
      const savedCity = await this.cityRepository.save(city);
      this.logInfo('Ciudad creada exitosamente', { id: savedCity.id });
      return savedCity;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear ciudad');
    }
  }

  async findAllCities(): Promise<City[]> {
    try {
      const cities = await this.cityRepository.find({
        relations: ['state', 'state.country'],
        order: { name: 'ASC' },
      });
      this.logInfo(`Se encontraron ${cities.length} ciudades`);
      return cities;
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener ciudades');
    }
  }

  async findCitiesByState(stateId: string): Promise<City[]> {
    try {
      await this.findOneState(stateId);
      const cities = await this.cityRepository.find({
        where: { stateId: parseInt(stateId) },
        relations: ['state'],
        order: { name: 'ASC' },
      });
      this.logInfo(
        `Se encontraron ${cities.length} ciudades para el estado ${stateId}`,
      );
      return cities;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener ciudades del estado ${stateId}`,
      );
    }
  }

  async findOneCity(id: string): Promise<City> {
    try {
      const city = await this.cityRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['state', 'state.country'],
      });

      if (!city) {
        this.createNotFoundError('Ciudad', id);
      }

      return city;
    } catch (error) {
      this.handleServiceError(error, `Error al obtener ciudad con ID ${id}`);
    }
  }

  async updateCity(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    try {
      const city = await this.findOneCity(id);

      if (updateCityDto.stateId) {
        await this.findOneState(updateCityDto.stateId.toString());
      }

      Object.assign(city, {
        ...updateCityDto,
        updatedBy: 'system',
      });

      const updatedCity = await this.cityRepository.save(city);
      this.logInfo('Ciudad actualizada exitosamente', { id: updatedCity.id });
      return updatedCity;
    } catch (error) {
      this.handleServiceError(error, `Error al actualizar ciudad con ID ${id}`);
    }
  }

  async removeCity(id: string): Promise<void> {
    try {
      const city = await this.findOneCity(id);
      await this.cityRepository.softRemove(city);
      this.logInfo('Ciudad eliminada exitosamente', { id });
    } catch (error) {
      this.handleServiceError(error, `Error al eliminar ciudad con ID ${id}`);
    }
  }
}
