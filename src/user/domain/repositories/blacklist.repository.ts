import { Blacklist } from '../../infrastructure/database/entities/blacklist.entity';

export interface BlacklistRepository {
  create(data: Partial<Blacklist>): Promise<Blacklist>;
  findByEmail(email: string): Promise<Blacklist | null>;
  findAll(): Promise<Blacklist[]>;
  getAllEmails(): Promise<string[]>;
  delete(id: number): Promise<boolean>;
}
