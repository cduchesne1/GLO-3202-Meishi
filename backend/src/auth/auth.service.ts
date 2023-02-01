import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (
      user !== undefined &&
      (await this.encryptionService.compare(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async createToken(uid: string, username: string, email: string) {
    return {
      access_token: this.jwtService.sign({
        sub: uid,
        username,
        email,
      }),
    };
  }
}
