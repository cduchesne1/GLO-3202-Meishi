import { Type } from 'class-transformer';
import {
  IsArray,
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
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
  @IsNotEmpty()
  @IsUrl()
  readonly url: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsBase64()
  readonly picture?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(80)
  readonly bio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Link)
  @IsOptional()
  readonly links?: Link[];
}
