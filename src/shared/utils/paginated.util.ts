import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

interface PaginatedParams {
  size: number;
  page: number;
  count: number;
}

export class Paginated {
  public count: number;
  public pageSize: number;
  public totalPages: number;
  public current: number;

  static create(params: PaginatedParams): Paginated {
    const response: Paginated = {
      current: params.page,
      pageSize: params.size,
      totalPages: Math.ceil(params.count / params.size),
      count: params.count,
    };
    return response;
  }

  static getOffset(page: number, size: number): number {
    return size * (page - 1);
  }

  static getLimit(size: number): number {
    return Math.min(Math.max(size, 1), 100);
  }

  static validatePage(page: number): number {
    return Math.max(page, 1);
  }
}

export class PaginatedDto {
  @ApiProperty({ description: 'Current page' })
  @Expose()
  current: number;

  @ApiProperty({ description: 'Page size' })
  @Expose()
  pageSize: number;

  @ApiProperty({ description: 'Total pages' })
  @Expose()
  totalPages: number;

  @ApiProperty({ description: 'Count' })
  @Expose()
  count: number;
}

export class PaginatedDataDto<T> {
  @ApiProperty({ description: 'Pagination info' })
  @Expose()
  pagination: PaginatedDto;

  @ApiProperty({ description: 'Data array' })
  @Expose()
  data: T[];
}

export interface PaginationQuery {
  page?: number;
  size?: number;
}

export const buildPaginatedResponse = <T>(
  data: T[],
  count: number,
  page: number,
  size: number,
): PaginatedDataDto<T> => {
  return {
    data,
    pagination: Paginated.create({ page, size, count }),
  };
};
