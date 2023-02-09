import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CheckTokenDto } from './dto/check-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(ValidationPipe)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() response) {
    if (await this.usersService.isUsernameTaken(createUserDto.username)) {
      throw new BadRequestException(
        `Username ${createUserDto.username} is already taken.`,
      );
    }

    const user = await this.usersService.create(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    const { fingerprint, hash } = this.authService.generateFingerprint();

    const accessToken = await this.authService.createAccessToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
      user.email,
      hash,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
    );

    const json = user.toJSON();
    response.cookie('Secure-Fgp', fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
      sameSite: 'strict',
    });

    return response.status(HttpStatus.CREATED).json({
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      tokenManager: {
        accessToken,
        expirationTime: Date.now() + 3600 * 1000,
        refreshToken,
      },
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() request, @Res() response) {
    const { user } = request;
    const { fingerprint, hash } = this.authService.generateFingerprint();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const accessToken = await this.authService.createAccessToken(
      user.uid,
      user.username,
      user.email,
      hash,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
    );

    const json = user.toJSON();

    response.cookie('Secure-Fgp', fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
      sameSite: 'strict',
    });

    return response.status(HttpStatus.OK).json({
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      tokenManager: {
        accessToken,
        expirationTime: Date.now() + 3600 * 1000,
        refreshToken,
      },
    });
  }

  @UsePipes(ValidationPipe)
  @Post('checkToken')
  @HttpCode(200)
  async checkToken(@Req() request, @Body() checkTokenDto: CheckTokenDto) {
    const fingerprint = request.cookies ? request.cookies['Secure-Fgp'] : '';
    const { accessToken } = checkTokenDto;
    await this.authService.verifyToken(accessToken, fingerprint);

    return {
      valid: true,
    };
  }

  @UsePipes(ValidationPipe)
  @Post('token')
  async token(@Body() refreshTokenDto: RefreshTokenDto, @Res() response) {
    const { refreshToken } = refreshTokenDto;
    const newTokens = await this.authService.refreshToken(refreshToken);

    response.cookie('Secure-Fgp', newTokens.fingerprint, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
      sameSite: 'strict',
    });

    return response.status(HttpStatus.OK).json({
      accessToken: newTokens.accessToken,
      expirationTime: Date.now() + 3600 * 1000,
      refreshToken: newTokens.refreshToken,
    });
  }
}
