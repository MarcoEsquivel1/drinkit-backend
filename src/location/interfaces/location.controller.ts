import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { LocationService } from '../use-cases/location.service';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CountryResponseDto,
  CreateStateDto,
  UpdateStateDto,
  StateResponseDto,
  CreateCityDto,
  UpdateCityDto,
  CityResponseDto,
} from './dtos';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('countries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo país' })
  @ApiResponse({
    status: 201,
    description: 'País creado exitosamente',
    type: CountryResponseDto,
  })
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    const country = await this.locationService.createCountry(createCountryDto);
    return plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
  }

  @Get('countries')
  @ApiOperation({ summary: 'Obtener todos los países' })
  @ApiResponse({
    status: 200,
    description: 'Lista de países obtenida exitosamente',
    type: [CountryResponseDto],
  })
  async findAllCountries(): Promise<CountryResponseDto[]> {
    const countries = await this.locationService.findAllCountries();
    return countries.map((country) =>
      plainToInstance(CountryResponseDto, country, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Obtener un país por ID' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'País obtenido exitosamente',
    type: CountryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  async findOneCountry(@Param('id') id: string): Promise<CountryResponseDto> {
    const country = await this.locationService.findOneCountry(id);
    return plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('countries/:id')
  @ApiOperation({ summary: 'Actualizar un país' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'País actualizado exitosamente',
    type: CountryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  async updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    const country = await this.locationService.updateCountry(
      id,
      updateCountryDto,
    );
    return plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('countries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un país' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({ status: 204, description: 'País eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'País no encontrado' })
  async removeCountry(@Param('id') id: string): Promise<void> {
    return this.locationService.removeCountry(id);
  }

  @Post('states')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiResponse({
    status: 201,
    description: 'Estado creado exitosamente',
    type: StateResponseDto,
  })
  async createState(
    @Body() createStateDto: CreateStateDto,
  ): Promise<StateResponseDto> {
    const state = await this.locationService.createState(createStateDto);
    return plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
  }

  @Get('states')
  @ApiOperation({ summary: 'Obtener todos los estados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados obtenida exitosamente',
    type: [StateResponseDto],
  })
  async findAllStates(): Promise<StateResponseDto[]> {
    const states = await this.locationService.findAllStates();
    return states.map((state) =>
      plainToInstance(StateResponseDto, state, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('countries/:countryId/states')
  @ApiOperation({ summary: 'Obtener estados por país' })
  @ApiParam({ name: 'countryId', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados del país obtenida exitosamente',
    type: [StateResponseDto],
  })
  async findStatesByCountry(
    @Param('countryId') countryId: string,
  ): Promise<StateResponseDto[]> {
    const states = await this.locationService.findStatesByCountry(countryId);
    return states.map((state) =>
      plainToInstance(StateResponseDto, state, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Estado obtenido exitosamente',
    type: StateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async findOneState(@Param('id') id: string): Promise<StateResponseDto> {
    const state = await this.locationService.findOneState(id);
    return plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('states/:id')
  @ApiOperation({ summary: 'Actualizar un estado' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: StateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async updateState(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<StateResponseDto> {
    const state = await this.locationService.updateState(id, updateStateDto);
    return plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('states/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un estado' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({ status: 204, description: 'Estado eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async removeState(@Param('id') id: string): Promise<void> {
    return this.locationService.removeState(id);
  }

  @Post('cities')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva ciudad' })
  @ApiResponse({
    status: 201,
    description: 'Ciudad creada exitosamente',
    type: CityResponseDto,
  })
  async createCity(
    @Body() createCityDto: CreateCityDto,
  ): Promise<CityResponseDto> {
    const city = await this.locationService.createCity(createCityDto);
    return plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
  }

  @Get('cities')
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades obtenida exitosamente',
    type: [CityResponseDto],
  })
  async findAllCities(): Promise<CityResponseDto[]> {
    const cities = await this.locationService.findAllCities();
    return cities.map((city) =>
      plainToInstance(CityResponseDto, city, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('states/:stateId/cities')
  @ApiOperation({ summary: 'Obtener ciudades por estado' })
  @ApiParam({ name: 'stateId', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades del estado obtenida exitosamente',
    type: [CityResponseDto],
  })
  async findCitiesByState(
    @Param('stateId') stateId: string,
  ): Promise<CityResponseDto[]> {
    const cities = await this.locationService.findCitiesByState(stateId);
    return cities.map((city) =>
      plainToInstance(CityResponseDto, city, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Obtener una ciudad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({
    status: 200,
    description: 'Ciudad obtenida exitosamente',
    type: CityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  async findOneCity(@Param('id') id: string): Promise<CityResponseDto> {
    const city = await this.locationService.findOneCity(id);
    return plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('cities/:id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({
    status: 200,
    description: 'Ciudad actualizada exitosamente',
    type: CityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  async updateCity(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CityResponseDto> {
    const city = await this.locationService.updateCity(id, updateCityDto);
    return plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('cities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({ status: 204, description: 'Ciudad eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Ciudad no encontrada' })
  async removeCity(@Param('id') id: string): Promise<void> {
    return this.locationService.removeCity(id);
  }
}
