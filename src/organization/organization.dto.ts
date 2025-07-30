import { IsArray, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can only contain letters, numbers, and hyphens',
  })
  @IsOptional()
  slug: string;
}

export class FilterOrganizationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  memberIds: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  limit: number;
}

export class MembersToOrganizationDto {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  memberIds: string[];
}
