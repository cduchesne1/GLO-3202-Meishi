import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly encryptionService: EncryptionService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(_err, user, _info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const fingerprint = request.cookies ? request.cookies['Secure-Fgp'] : '';
    const fingerprintHash = this.encryptionService.hashFingerprint(fingerprint);

    if (!fingerprint || !user || fingerprintHash !== user.fingerprint) {
      throw new UnauthorizedException();
    }

    return user.user;
  }
}
