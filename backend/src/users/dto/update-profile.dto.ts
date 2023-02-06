import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Link {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsUrl()
  readonly url: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  readonly picture?: string;

  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly bio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Link)
  @IsOptional()
  readonly links?: Link[];
}
