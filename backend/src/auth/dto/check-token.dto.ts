import { IsNotEmpty, IsString } from 'class-validator';

export class CheckTokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
