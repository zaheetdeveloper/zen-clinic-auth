import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
   @IsString()
   @ApiProperty()
   userName: string;

   @IsEmail()
   @ApiProperty()
   email: string;

   @IsEmail()
   @ApiProperty()
   roles: string[];
}
