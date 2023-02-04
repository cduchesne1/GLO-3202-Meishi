import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (
      user !== null &&
      (await this.encryptionService.compare(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async createAccessToken(uid: string, username: string, email: string) {
    return this.jwtService.sign(
      {
        sub: uid,
        username,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: 3600,
      },
    );
  }

  async createRefreshToken(uid: string, username: string, email: string) {
    return this.jwtService.sign(
      {
        sub: uid,
        username,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub, username, email } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return {
        accessToken: await this.createAccessToken(sub, username, email),
        refreshToken: await this.createRefreshToken(sub, username, email),
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
