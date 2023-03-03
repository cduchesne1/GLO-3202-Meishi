import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
      hash,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
    );

    const json = user.toJSON();
    const { title, bio, picture, links } = json.profile;

    this.addCookiesToResponse(response, accessToken, refreshToken, fingerprint);

    return response.status(HttpStatus.CREATED).json({
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      profile: {
        title,
        bio,
        picture,
        links,
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
      hash,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
    );

    const json = user.toJSON();
    const { title, bio, picture, links } = json.profile;

    this.addCookiesToResponse(response, accessToken, refreshToken, fingerprint);

    return response.status(HttpStatus.OK).json({
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      profile: {
        title,
        bio,
        picture,
        links,
      },
    });
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('checkToken')
  @HttpCode(200)
  async checkToken(@Req() request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return {
      valid: true,
    };
  }

  @UsePipes(ValidationPipe)
  @Post('token')
  @HttpCode(200)
  async token(@Req() request, @Res() response) {
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const newTokens = await this.authService.refreshToken(refreshToken);

    this.addCookiesToResponse(
      response,
      newTokens.accessToken,
      newTokens.refreshToken,
      newTokens.fingerprint,
    );

    return response.status(HttpStatus.OK).json();
  }

  @UsePipes(ValidationPipe)
  @Post('logout')
  @HttpCode(200)
  async logout(@Res() response) {
    response.clearCookie('Secure-Fgp');
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return response.status(HttpStatus.OK).json();
  }

  private addCookiesToResponse(
    response: any,
    accessToken: string,
    refreshToken: string,
    fingerprint: string,
  ) {
    response.cookie('Secure-Fgp', fingerprint, {
      domain:
        process.env.NODE_ENV === 'production' ? '.meishi.social' : undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
      sameSite: 'strict',
    });
    response.cookie('access_token', accessToken, {
      domain:
        process.env.NODE_ENV === 'production' ? '.meishi.social' : undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
      sameSite: 'strict',
    });
    response.cookie('refresh_token', refreshToken, {
      domain:
        process.env.NODE_ENV === 'production' ? '.meishi.social' : undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 24 * 7 * 1000,
    });
  }
}
