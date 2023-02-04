import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CheckUsernameDto } from './dto/check-username.dto';
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
}
