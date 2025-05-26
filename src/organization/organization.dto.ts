import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
   @ApiProperty()
   @IsString()
   name: string;

   @ApiProperty()
   @IsString()
   description: string;
}


export class UpdateOrganizationDto {
   @ApiProperty()
   @IsString()
   name: string;

   @ApiProperty()
   @IsString()
   description: string;

   @ApiProperty()
   @IsString()
   createdBy: string;
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
