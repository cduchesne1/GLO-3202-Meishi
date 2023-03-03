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

  generateFingerprint() {
    return this.encryptionService.generateFingerprint();
  }

  async createAccessToken(
    uid: string,
    username: string,
    fingerprintHash: string,
  ) {
    return this.jwtService.sign(
      {
        sub: uid,
        username,
        userFingerPrint: fingerprintHash,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: 3600,
      },
    );
  }

  async verifyToken(token: string, fingerprint: string) {
    try {
      const fingerprintHash =
        this.encryptionService.hashFingerprint(fingerprint);
      const { sub, username, userFingerPrint } = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (userFingerPrint !== fingerprintHash) {
        throw new UnauthorizedException();
      }

      return {
        uid: sub,
        username,
        userFingerPrint,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async createRefreshToken(uid: string, username: string) {
    return this.jwtService.sign(
      {
        sub: uid,
        username,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async refreshToken(refreshToken: string) {
    try {
      const { sub, username } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const { fingerprint, hash } = this.generateFingerprint();

      return {
        accessToken: await this.createAccessToken(sub, username, hash),
        refreshToken: await this.createRefreshToken(sub, username),
        fingerprint,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
