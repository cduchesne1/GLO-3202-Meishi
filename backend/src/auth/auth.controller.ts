import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = await this.authService.createToken(
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
      access_token,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request) {
    const { user } = request;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = await this.authService.createToken(
      user.uid,
      user.username,
      user.email,
    );

    const json = user.toJSON();

    return {
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      access_token,
    };
  }
}
