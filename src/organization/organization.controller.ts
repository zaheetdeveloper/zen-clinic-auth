import {
  Body, Controller, Delete, Get,
  Param, Post, Put, Query
} from '@nestjs/common';

import {
  MembersToOrganizationDto, CreateOrganizationDto,
  FilterOrganizationDto, UpdateOrganizationDto
} from './organization.dto';

import { Organization } from './organization.entity';
import { User } from 'src/users/entities/user.entity';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Post()
  async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<string> {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get()
  async findAllOrganizations(@Query() filterOrganizationDto: FilterOrganizationDto): Promise<Organization[]> {
    return this.organizationService.findAllOrganizations(filterOrganizationDto);
  }

  @Get(':id')
  async findOrganizationById(@Param('id') id: string): Promise<Organization | null> {
    return this.organizationService.findOrganizationById(id);
  }

  @Put(':id')
  async updateOrganization(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
    return this.organizationService.updateOrganization(id, updateOrganizationDto);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string): Promise<void> {
    return this.organizationService.deleteOrganization(id);
  }

  @Put(':id/members')
  async addMembersToOrganization(
    @Param('id') id: string,
    @Body() addMembersToOrganizationDto: MembersToOrganizationDto,
  ): Promise<Organization | null> {
    // if memberIds is not an array of strings, convert it to an array of strings
    if (!Array.isArray(addMembersToOrganizationDto.memberIds)) {
      addMembersToOrganizationDto.memberIds = [addMembersToOrganizationDto.memberIds];
    }
    return this.organizationService.addMemberToOrganization(id, addMembersToOrganizationDto.memberIds);
  }

  @Delete(':id/members/:memberId')
  async removeMemberFromOrganization(@Param('id') id: string, @Body() addMembersToOrganizationDto: MembersToOrganizationDto,): Promise<Organization | null> {
    return this.organizationService.removeMemberFromOrganization(id, addMembersToOrganizationDto.memberIds);
  }

  @Get(':id/members')
  async getOrganizationMembers(@Param('id') id: string): Promise<User[]> {
    return this.organizationService.getOrganizationMembers(id);
  }


  @Get('organization/:memberId/byId')
  async getOrgOfMember(@Param('memberId') memberId: string) {
    return await this.organizationService.getOrgOfMember(memberId)
  }

}
