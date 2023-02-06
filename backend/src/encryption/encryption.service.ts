import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class EncryptionService {
  async hash(plain: string): Promise<string> {
    return hash(plain, 10);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }

  generateFingerprint(): { fingerprint: string; hash: string } {
    const fingerprint = randomBytes(50).toString('hex');

    return { fingerprint, hash: this.hashFingerprint(fingerprint) };
  }

  hashFingerprint(fingerprint: string): string {
    return createHash('sha256').update(fingerprint).digest('hex');
  }
}
