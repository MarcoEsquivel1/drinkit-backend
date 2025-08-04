// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { BaseService } from '../services/base.service';

// // Template para crear servicios que extiendan BaseService
// // Reemplaza EntityName con el nombre de tu entidad
// // Reemplaza CreateDto, UpdateDto con tus DTOs

// @Injectable()
// export class EntityNameService extends BaseService {
//   constructor(
//     @InjectRepository(EntityName)
//     private readonly entityRepository: Repository<EntityName>,
//   ) {
//     super();
//   }

//   async create(createDto: CreateDto): Promise<EntityName> {
//     try {
//       const entity = this.entityRepository.create({
//         ...createDto,
//         createdBy: 'system',
//       });
//       const savedEntity = await this.entityRepository.save(entity);
//       this.logInfo('Entidad creada exitosamente', { id: savedEntity.id });
//       return savedEntity;
//     } catch (error) {
//       this.handleServiceError(error, 'Error al crear entidad');
//     }
//   }

//   async findAll(): Promise<EntityName[]> {
//     try {
//       const entities = await this.entityRepository.find({
//         // Agregar relaciones si es necesario
//         // relations: ['relation1', 'relation2'],
//         // order: { createdAt: 'DESC' },
//       });
//       this.logInfo(`Se encontraron ${entities.length} entidades`);
//       return entities;
//     } catch (error) {
//       this.handleServiceError(error, 'Error al obtener entidades');
//     }
//   }

//   async findOne(id: string): Promise<EntityName> {
//     try {
//       const entity = await this.entityRepository.findOne({
//         where: { id },
//         // Agregar relaciones si es necesario
//         // relations: ['relation1', 'relation2'],
//       });

//       if (!entity) {
//         this.createNotFoundError('Entidad', id);
//       }

//       return entity;
//     } catch (error) {
//       this.handleServiceError(error, `Error al obtener entidad con ID ${id}`);
//     }
//   }

//   async update(id: string, updateDto: UpdateDto): Promise<EntityName> {
//     try {
//       const entity = await this.findOne(id);

//       Object.assign(entity, {
//         ...updateDto,
//         updatedBy: 'system',
//       });

//       const updatedEntity = await this.entityRepository.save(entity);
//       this.logInfo('Entidad actualizada exitosamente', {
//         id: updatedEntity.id,
//       });
//       return updatedEntity;
//     } catch (error) {
//       this.handleServiceError(
//         error,
//         `Error al actualizar entidad con ID ${id}`,
//       );
//     }
//   }

//   async remove(id: string): Promise<void> {
//     try {
//       const entity = await this.findOne(id);
//       await this.entityRepository.softRemove(entity);
//       this.logInfo('Entidad eliminada exitosamente', { id });
//     } catch (error) {
//       this.handleServiceError(error, `Error al eliminar entidad con ID ${id}`);
//     }
//   }
// }
