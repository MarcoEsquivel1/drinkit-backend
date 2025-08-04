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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { LocationService } from '../use-cases/location.service';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CountryResponseDto,
  CountrySingleResponseDto,
  CountryCollectionResponseDto,
  CreateStateDto,
  UpdateStateDto,
  StateResponseDto,
  StateSingleResponseDto,
  StateCollectionResponseDto,
  CreateCityDto,
  UpdateCityDto,
  CityResponseDto,
  CitySingleResponseDto,
  CityCollectionResponseDto,
} from './dtos';
import { ResponseDto, ResponseBuilder } from '../../shared/dtos/response.dto';
import {
  createErrorSchemas,
  createSuccessNullSchema,
} from '../../shared/utils/swagger.util';

@ApiTags('Location')
@ApiExtraModels(
  CountryResponseDto,
  CountrySingleResponseDto,
  CountryCollectionResponseDto,
  StateResponseDto,
  StateSingleResponseDto,
  StateCollectionResponseDto,
  CityResponseDto,
  CitySingleResponseDto,
  CityCollectionResponseDto,
)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('countries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo país' })
  @ApiResponse({
    status: 201,
    description: 'País creado exitosamente',
    type: CountrySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountrySingleResponseDto> {
    const country = await this.locationService.createCountry(createCountryDto);
    const responseData = plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'País creado exitosamente',
    ) as CountrySingleResponseDto;
  }

  @Get('countries')
  @ApiOperation({ summary: 'Obtener todos los países' })
  @ApiResponse({
    status: 200,
    description: 'Lista de países obtenida exitosamente',
    type: CountryCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAllCountries(): Promise<CountryCollectionResponseDto> {
    const countries = await this.locationService.findAllCountries();
    const responseData = countries.map((country) =>
      plainToInstance(CountryResponseDto, country, {
        excludeExtraneousValues: true,
      }),
    );
    return ResponseBuilder.success(
      responseData,
      'Países obtenidos exitosamente',
    ) as CountryCollectionResponseDto;
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Obtener un país por ID' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'País obtenido exitosamente',
    type: CountrySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'País no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOneCountry(
    @Param('id') id: string,
  ): Promise<CountrySingleResponseDto> {
    const country = await this.locationService.findOneCountry(id);
    const responseData = plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'País obtenido exitosamente',
    ) as CountrySingleResponseDto;
  }

  @Patch('countries/:id')
  @ApiOperation({ summary: 'Actualizar un país' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'País actualizado exitosamente',
    type: CountrySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'País no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<CountrySingleResponseDto> {
    const country = await this.locationService.updateCountry(
      id,
      updateCountryDto,
    );
    const responseData = plainToInstance(CountryResponseDto, country, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'País actualizado exitosamente',
    ) as CountrySingleResponseDto;
  }

  @Delete('countries/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un país' })
  @ApiParam({ name: 'id', description: 'ID del país' })
  @ApiResponse({
    status: 204,
    description: 'País eliminado exitosamente',
    schema: createSuccessNullSchema('País eliminado exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'País no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async removeCountry(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.locationService.removeCountry(id);
    return ResponseBuilder.success(null, 'País eliminado exitosamente');
  }

  @Post('states')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiResponse({
    status: 201,
    description: 'Estado creado exitosamente',
    type: StateSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async createState(
    @Body() createStateDto: CreateStateDto,
  ): Promise<StateSingleResponseDto> {
    const state = await this.locationService.createState(createStateDto);
    const responseData = plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Estado creado exitosamente',
    ) as StateSingleResponseDto;
  }

  @Get('states')
  @ApiOperation({ summary: 'Obtener todos los estados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados obtenida exitosamente',
    type: StateCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAllStates(): Promise<StateCollectionResponseDto> {
    const states = await this.locationService.findAllStates();
    const responseData = states.map((state) =>
      plainToInstance(StateResponseDto, state, {
        excludeExtraneousValues: true,
      }),
    );
    return ResponseBuilder.success(
      responseData,
      'Estados obtenidos exitosamente',
    ) as StateCollectionResponseDto;
  }

  @Get('countries/:countryId/states')
  @ApiOperation({ summary: 'Obtener estados por país' })
  @ApiParam({ name: 'countryId', description: 'ID del país' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados del país obtenida exitosamente',
    type: StateCollectionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'País no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findStatesByCountry(
    @Param('countryId') countryId: string,
  ): Promise<StateCollectionResponseDto> {
    const states = await this.locationService.findStatesByCountry(countryId);
    const responseData = states.map((state) =>
      plainToInstance(StateResponseDto, state, {
        excludeExtraneousValues: true,
      }),
    );
    return ResponseBuilder.success(
      responseData,
      'Estados del país obtenidos exitosamente',
    ) as StateCollectionResponseDto;
  }

  @Get('states/:id')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Estado obtenido exitosamente',
    type: StateSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estado no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOneState(@Param('id') id: string): Promise<StateSingleResponseDto> {
    const state = await this.locationService.findOneState(id);
    const responseData = plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Estado obtenido exitosamente',
    ) as StateSingleResponseDto;
  }

  @Patch('states/:id')
  @ApiOperation({ summary: 'Actualizar un estado' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: StateSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Estado no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async updateState(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<StateSingleResponseDto> {
    const state = await this.locationService.updateState(id, updateStateDto);
    const responseData = plainToInstance(StateResponseDto, state, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Estado actualizado exitosamente',
    ) as StateSingleResponseDto;
  }

  @Delete('states/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un estado' })
  @ApiParam({ name: 'id', description: 'ID del estado' })
  @ApiResponse({
    status: 204,
    description: 'Estado eliminado exitosamente',
    schema: createSuccessNullSchema('Estado eliminado exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'Estado no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async removeState(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.locationService.removeState(id);
    return ResponseBuilder.success(null, 'Estado eliminado exitosamente');
  }

  @Post('cities')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva ciudad' })
  @ApiResponse({
    status: 201,
    description: 'Ciudad creada exitosamente',
    type: CitySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async createCity(
    @Body() createCityDto: CreateCityDto,
  ): Promise<CitySingleResponseDto> {
    const city = await this.locationService.createCity(createCityDto);
    const responseData = plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Ciudad creada exitosamente',
    ) as CitySingleResponseDto;
  }

  @Get('cities')
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades obtenida exitosamente',
    type: CityCollectionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findAllCities(): Promise<CityCollectionResponseDto> {
    const cities = await this.locationService.findAllCities();
    const responseData = cities.map((city) =>
      plainToInstance(CityResponseDto, city, {
        excludeExtraneousValues: true,
      }),
    );
    return ResponseBuilder.success(
      responseData,
      'Ciudades obtenidas exitosamente',
    ) as CityCollectionResponseDto;
  }

  @Get('states/:stateId/cities')
  @ApiOperation({ summary: 'Obtener ciudades por estado' })
  @ApiParam({ name: 'stateId', description: 'ID del estado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades del estado obtenida exitosamente',
    type: CityCollectionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estado no encontrado',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findCitiesByState(
    @Param('stateId') stateId: string,
  ): Promise<CityCollectionResponseDto> {
    const cities = await this.locationService.findCitiesByState(stateId);
    const responseData = cities.map((city) =>
      plainToInstance(CityResponseDto, city, {
        excludeExtraneousValues: true,
      }),
    );
    return ResponseBuilder.success(
      responseData,
      'Ciudades del estado obtenidas exitosamente',
    ) as CityCollectionResponseDto;
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Obtener una ciudad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({
    status: 200,
    description: 'Ciudad obtenida exitosamente',
    type: CitySingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async findOneCity(@Param('id') id: string): Promise<CitySingleResponseDto> {
    const city = await this.locationService.findOneCity(id);
    const responseData = plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Ciudad obtenida exitosamente',
    ) as CitySingleResponseDto;
  }

  @Patch('cities/:id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({
    status: 200,
    description: 'Ciudad actualizada exitosamente',
    type: CitySingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async updateCity(
    @Param('id') id: string,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CitySingleResponseDto> {
    const city = await this.locationService.updateCity(id, updateCityDto);
    const responseData = plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
    return ResponseBuilder.success(
      responseData,
      'Ciudad actualizada exitosamente',
    ) as CitySingleResponseDto;
  }

  @Delete('cities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  @ApiParam({ name: 'id', description: 'ID de la ciudad' })
  @ApiResponse({
    status: 204,
    description: 'Ciudad eliminada exitosamente',
    schema: createSuccessNullSchema('Ciudad eliminada exitosamente'),
  })
  @ApiResponse({
    status: 404,
    description: 'Ciudad no encontrada',
    schema: createErrorSchemas()[404],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async removeCity(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.locationService.removeCity(id);
    return ResponseBuilder.success(null, 'Ciudad eliminada exitosamente');
  }
}
