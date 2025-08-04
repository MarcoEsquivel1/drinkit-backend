// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   HttpStatus,
//   HttpCode,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
// import { plainToInstance } from 'class-transformer';
// import { ResponseDto, ResponseBuilder } from '../dtos/response.dto';

// // Template para crear controladores que usen ResponseDto
// // Reemplaza EntityName con el nombre de tu entidad
// // Reemplaza CreateDto, UpdateDto, ResponseDto con tus DTOs

// @ApiTags('EntityName')
// @Controller('entity-name')
// export class EntityNameController {
//   constructor(private readonly entityService: EntityNameService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Crear una nueva entidad' })
//   @ApiResponse({
//     status: 201,
//     description: 'Entidad creada exitosamente',
//     type: EntityResponseDto,
//   })
//   async create(
//     @Body() createDto: CreateDto,
//   ): Promise<ResponseDto<EntityResponseDto>> {
//     const entity = await this.entityService.create(createDto);
//     const responseData = plainToInstance(EntityResponseDto, entity, {
//       excludeExtraneousValues: true,
//     });
//     return ResponseBuilder.success(responseData, 'Entidad creada exitosamente');
//   }

//   @Get()
//   @ApiOperation({ summary: 'Obtener todas las entidades' })
//   @ApiResponse({
//     status: 200,
//     description: 'Lista de entidades obtenida exitosamente',
//     type: [EntityResponseDto],
//   })
//   async findAll(): Promise<ResponseDto<EntityResponseDto[]>> {
//     const entities = await this.entityService.findAll();
//     const responseData = entities.map((entity) =>
//       plainToInstance(EntityResponseDto, entity, {
//         excludeExtraneousValues: true,
//       }),
//     );
//     return ResponseBuilder.success(
//       responseData,
//       'Entidades obtenidas exitosamente',
//     );
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtener una entidad por ID' })
//   @ApiParam({ name: 'id', description: 'ID de la entidad' })
//   @ApiResponse({
//     status: 200,
//     description: 'Entidad obtenida exitosamente',
//     type: EntityResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Entidad no encontrada' })
//   async findOne(
//     @Param('id') id: string,
//   ): Promise<ResponseDto<EntityResponseDto>> {
//     const entity = await this.entityService.findOne(id);
//     const responseData = plainToInstance(EntityResponseDto, entity, {
//       excludeExtraneousValues: true,
//     });
//     return ResponseBuilder.success(
//       responseData,
//       'Entidad obtenida exitosamente',
//     );
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Actualizar una entidad' })
//   @ApiParam({ name: 'id', description: 'ID de la entidad' })
//   @ApiResponse({
//     status: 200,
//     description: 'Entidad actualizada exitosamente',
//     type: EntityResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Entidad no encontrada' })
//   async update(
//     @Param('id') id: string,
//     @Body() updateDto: UpdateDto,
//   ): Promise<ResponseDto<EntityResponseDto>> {
//     const entity = await this.entityService.update(id, updateDto);
//     const responseData = plainToInstance(EntityResponseDto, entity, {
//       excludeExtraneousValues: true,
//     });
//     return ResponseBuilder.success(
//       responseData,
//       'Entidad actualizada exitosamente',
//     );
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Eliminar una entidad' })
//   @ApiParam({ name: 'id', description: 'ID de la entidad' })
//   @ApiResponse({
//     status: 204,
//     description: 'Entidad eliminada exitosamente',
//   })
//   @ApiResponse({ status: 404, description: 'Entidad no encontrada' })
//   async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
//     await this.entityService.remove(id);
//     return ResponseBuilder.success(null, 'Entidad eliminada exitosamente');
//   }
// }
