import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class Link {
  @IsString()
  readonly title: string;

  @IsString()
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
