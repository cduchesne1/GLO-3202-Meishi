import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.username.length > 30) {
      throw new BadRequestException(
        'Username must be less than 30 characters.',
      );
    }

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

    const accessToken = await this.authService.createAccessToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
      user.email,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
      user.email,
    );

    const json = user.toJSON();
    return {
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      tokenManager: {
        accessToken,
        expirationTime: Date.now() + 3600 * 1000,
        refreshToken,
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() request) {
    const { user } = request;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const accessToken = await this.authService.createAccessToken(
      user.uid,
      user.username,
      user.email,
    );

    const refreshToken = await this.authService.createRefreshToken(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      user.username,
      user.email,
    );

    const json = user.toJSON();
    return {
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      tokenManager: {
        accessToken,
        expirationTime: Date.now() + 3600 * 1000,
        refreshToken,
      },
    };
  }

  @Post('token')
  async token(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const newTokens = await this.authService.refreshToken(refreshToken);

    return {
      accessToken: newTokens.accessToken,
      expirationTime: Date.now() + 3600 * 1000,
      refreshToken: newTokens.refreshToken,
    };
  }
}
