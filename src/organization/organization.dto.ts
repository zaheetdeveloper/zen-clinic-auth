import { IsArray, IsNumber, IsString } from "class-validator";
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



export class AddMemberToOrganizationDto {
   @ApiProperty()
   @IsString()
   memberId: string;
}


export class FilterOrganizationDto {
   @ApiProperty({ required: false })
   @IsString()
   search: string;

   @ApiProperty({ required: false })
   @IsArray()
   @IsString({ each: true })
   memberIds: string[];

   @ApiProperty({ required: false })
   @IsNumber()
   page: number;

   @ApiProperty({ required: false })
   @IsNumber()
   limit: number;


}


export class MembersToOrganizationDto {
   @ApiProperty()
   @IsArray()
   @IsString({ each: true })
   memberIds: string[];
}
