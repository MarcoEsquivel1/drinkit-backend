import { AppleFallback } from '../../infrastructure/database/entities/apple-fallback.entity';

export interface AppleFallbackRepository {
  create(data: Partial<AppleFallback>): Promise<AppleFallback>;
  findById(id: number): Promise<AppleFallback | null>;
  findByAppleId(appleId: string): Promise<AppleFallback | null>;
  findAll(limit?: number): Promise<AppleFallback[]>;
  update(
    id: number,
    data: Partial<AppleFallback>,
  ): Promise<AppleFallback | null>;
  delete(id: number): Promise<boolean>;
  count(): Promise<number>;
}
