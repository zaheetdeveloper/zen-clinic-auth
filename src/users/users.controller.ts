import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, getDefaultRoleDto, setRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.loginUser(createUserDto);
  }

  @Put('setRole')
  async setRole(@Body() dto: setRoleDto) {
    return await this.usersService.setRole(dto);
  }

  @Get('getDefaultRole')
  async getDefaultRole(@Query() dto: getDefaultRoleDto) {
    return await this.usersService.getDefaultRole(dto.id);
  }



  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }


  @Get('userId/:userId')
  async getUserByUserId(@Param('userId') userId: string) {
    return await this.usersService.getUserByUserId(userId);
  }
}
