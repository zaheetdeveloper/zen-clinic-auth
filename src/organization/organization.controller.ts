import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  MembersToOrganizationDto,
  CreateOrganizationDto,
  FilterOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';

import { Organization } from './organization.entity';
import { User } from 'src/users/entities/user.entity';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<string> {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get()
  async findAllOrganizations(
    @Query() filterOrganizationDto: FilterOrganizationDto,
  ): Promise<{ data: Organization[]; total: number; page: number }> {
    return this.organizationService.findAllOrganizations(filterOrganizationDto);
  }

  @Get(':slug')
  async findOrganizationBySlug(
    @Param('slug') slug: string,
  ): Promise<Organization | null> {
    return this.organizationService.findOrganizationBySlug(slug);
  }

  @Put(':slug')
  async updateOrganization(
    @Param('slug') slug: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<string> {
    return this.organizationService.updateOrganization(
      slug,
      updateOrganizationDto,
    );
  }

  @Delete(':slug')
  async deleteOrganization(@Param('slug') slug: string): Promise<void> {
    return this.organizationService.deleteOrganization(slug);
  }

  @Put(':slug/members')
  async addMembersToOrganization(
    @Param('slug') slug: string,
    @Body() addMembersToOrganizationDto: MembersToOrganizationDto,
  ): Promise<Organization | null> {
    if (!Array.isArray(addMembersToOrganizationDto.memberIds)) {
      addMembersToOrganizationDto.memberIds = [
        addMembersToOrganizationDto.memberIds,
      ];
    }
    return this.organizationService.addMemberToOrganization(
      slug,
      addMembersToOrganizationDto.memberIds,
    );
  }

  @Delete(':slug/members/:memberId')
  async removeMemberFromOrganization(
    @Param('slug') slug: string,
    @Body() addMembersToOrganizationDto: MembersToOrganizationDto,
  ): Promise<Organization | null> {
    return this.organizationService.removeMemberFromOrganization(
      slug,
      addMembersToOrganizationDto.memberIds,
    );
  }

  @Get(':slug/members')
  async getOrganizationMembers(@Param('slug') slug: string): Promise<User[]> {
    return this.organizationService.getOrganizationMembers(slug);
  }

  @Get('organization/:memberId/byId')
  async getOrgOfMember(@Param('memberId') memberId: string) {
    return await this.organizationService.getOrgOfMember(memberId);
  }
}
