import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMongoId, IsString } from "class-validator";
import { UserRoleEnum } from "src/shared/enum";

export class CreateUserDto {
   @IsString()
   @ApiProperty()
   userName: string;

   @IsString()
   @ApiProperty()
   userId: string;


   @ApiProperty()
   @IsEmail()
   email: string;

   @ApiProperty()
   @IsString()
   roles: string[];
}



export class setRoleDto {

   @ApiProperty()
   @IsString()
   id: string;

   @ApiProperty()
   @IsString()
   role: UserRoleEnum;
}


export class getDefaultRoleDto {

   @ApiProperty()
   @IsMongoId()
   @IsString()
   id: string;
}