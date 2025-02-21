import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

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

   @IsEmail()
   @ApiProperty()
   roles: string[];
}
