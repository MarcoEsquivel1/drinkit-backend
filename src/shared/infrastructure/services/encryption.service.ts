import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly saltRounds = 10;

  encryptPasswd(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
