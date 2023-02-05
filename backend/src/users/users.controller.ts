import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckUsernameDto } from './dto/check-username.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('check-username')
  @HttpCode(200)
  async checkUsername(
    @Body() checkUsernameDto: CheckUsernameDto,
  ): Promise<any> {
    if (checkUsernameDto.username.length > 30) {
      return {
        available: false,
        message: 'Username must be less than 30 characters.',
      };
    }

    if (await this.usersService.isUsernameTaken(checkUsernameDto.username)) {
      return {
        available: false,
        message: `Username "${checkUsernameDto.username}" is already taken.`,
      };
    }
    return { available: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request): Promise<any> {
    const { user } = request;

    const json = user.toJSON();
    return {
      // eslint-disable-next-line no-underscore-dangle
      uid: json._id.toString(),
      username: json.username,
      email: json.email,
      profile: json.profile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() request,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const { user } = request;

    await this.usersService.updateProfile(user, updateProfileDto);
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User "${username}" not found.`);
    }

    const json = user.toJSON();
    const { title, bio, picture, links } = json.profile;

    return {
      title,
      bio,
      picture,
      links,
    };
  }
}
