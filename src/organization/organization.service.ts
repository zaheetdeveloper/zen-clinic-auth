import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  FilterOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { createSlug, isValidName, isValidSlug } from 'src/shared/create-slug';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<Organization>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<string> {
    try {
      const name = createOrganizationDto.name;
      const slug = createOrganizationDto.slug ? createOrganizationDto.slug : createSlug(name);
      if (!isValidSlug(slug)) {
        throw new BadRequestException('Slug must be lowercase and can only contain letters, numbers, and hyphens');
      }
      if (!isValidName(name)) {
        throw new BadRequestException('Name must not contain special characters');
      }
      const existingOrganization = await this.organizationModel.findOne({
        slug,
      });

      if (existingOrganization) {
        throw new BadRequestException('Organization name already exists');
      }

      const createdOrganization = new this.organizationModel({
        ...createOrganizationDto,
        name,
        slug,
      });

      await createdOrganization.save();
      return createdOrganization.slug;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create organization');
    }
  }

  async findAllOrganizations(
    filterOrganizationDto: FilterOrganizationDto,
  ): Promise<{ data: Organization[]; total: number; page: number }> {
    const { search, memberIds, page = 1, limit = 10 } = filterOrganizationDto;
    const pageNumber = page;
    const limitNumber = limit;

    const query: FilterQuery<Organization> = {
      isActive: true,
    };

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    if (memberIds && memberIds.length > 0) {
      query.members = { $in: memberIds };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [organizations, total] = await Promise.all([
      this.organizationModel
        .find(query)
        .populate({
          path: 'members',
          select: '-createdAt -updatedAt -__v -userId -userName',
        })
        .select('-__v -createdAt -updatedAt')
        .skip(skip)
        .limit(limitNumber)
        .lean()
        .exec(),

      this.organizationModel.countDocuments(query),
    ]);

    return {
      data: organizations,
      total,
      page: pageNumber,
    };
  }

  async findOrganizationBySlug(slug: string): Promise<Organization | null> {
    return this.organizationModel
      .findOne({ slug: slug, isActive: true })
      .select('-__v -createdAt -updatedAt')
      .exec();
  }

  async updateOrganization(
    slug: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<string> {
    const updated = await this.organizationModel
      .findOneAndUpdate({ slug: slug, isActive: true }, updateOrganizationDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException('Organization not found');
    }
    return 'Organization updated successfully';
  }


  async deleteOrganization(slug: string): Promise<void> {
    const organization = await this.organizationModel
      .findOne({ slug: slug, isActive: true })
      .select('-__v -createdAt -updatedAt')
      .exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    organization.isActive = false;
    await organization.save();
  }

  async addMemberToOrganization(
    slug: string,
    memberIds: string[],
  ): Promise<Organization> {
    const updated = await this.organizationModel
      .findOneAndUpdate(
        { slug: slug, isActive: true },
        { $push: { members: { $each: memberIds } } },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Organization not found');
    }

    return updated;
  }


  async removeMemberFromOrganization(
    slug: string,
    memberIds: string[],
  ): Promise<Organization | null> {
    return this.organizationModel
      .findOneAndUpdate(
        { slug: slug, isActive: true },
        { $pull: { members: { $in: memberIds } } },
        { new: true },
      )
      .exec();
  }

  async getOrganizationMembers(slug: string): Promise<User[]> {
    const organization = await this.organizationModel
      .findOne({ slug: slug, isActive: true })
      .select('-__v -createdAt -updatedAt')
      .exec();
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return this.userModel.find({ _id: { $in: organization.members } }).exec();
  }

  async getOrgOfMember(memberId: string): Promise<Organization> {
    const org = await this.organizationModel
      .findOne({
        members: { $in: [memberId] },
      })
      .select('-createdAt -updatedAt -_id -isActive  -__v')
      .exec();

    if (!org) {
      throw new NotFoundException(
        `Organization not found for member ID: ${memberId}`,
      );
    }

    return org;
  }
}
