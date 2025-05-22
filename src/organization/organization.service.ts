import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrganizationDto, FilterOrganizationDto, UpdateOrganizationDto }
   from './organization.dto';


@Injectable()
export class OrganizationService {
   constructor(@InjectModel(Organization.name) private organizationModel: Model<Organization>,
      @InjectModel(User.name) private userModel: Model<User>
   ) { }

   async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<string> {
      try {
         // same user can create only one organization and organization name should be unique
         const existingOrganization = await this.organizationModel.findOne({ name: createOrganizationDto.name });
         if (existingOrganization) {
            throw new BadRequestException('Organization name already exists');
         }
         const createdOrganization = new this.organizationModel(createOrganizationDto);
         await createdOrganization.save();
         return 'Organization created successfully';
      } catch (error) {
         if (error instanceof BadRequestException) {
            throw error;
         }
         throw new BadRequestException('Failed to create organization');
      }
   }

   async findAllOrganizations(filterOrganizationDto: FilterOrganizationDto): Promise<Organization[]> {
      const { search, memberIds, page, limit } = filterOrganizationDto;
      const pageNumber = page || 1;
      const limitNumber = limit || 10;
      const query: any = {};

      query.isActive = true;

      if (search) {
         query.$or = [
            { name: { $regex: search, $options: 'i' } },
         ];
      }

      if (memberIds && memberIds.length > 0) {
         query.members = { $in: memberIds };
      }

      const skip = (pageNumber - 1) * limitNumber;
      const organizations = await this.organizationModel.find(query)
         .populate('members')
         .select('-__v -createdAt -updatedAt')
         .skip(skip)
         .limit(limit)
         .exec();

      return organizations;
   }
   async findOrganizationById(id: string): Promise<Organization | null> {
      return this.organizationModel.findOne({ _id: id, isActive: true }).exec();
   }

   async updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
      return this.organizationModel.findOneAndUpdate({ _id: id, isActive: true }, updateOrganizationDto, { new: true }).exec();
   }

   async deleteOrganization(id: string): Promise<void> {
      const organization = await this.organizationModel.findById(id).exec();
      if (!organization) {
         throw new NotFoundException('Organization not found');
      }
      organization.isActive = false;
      await organization.save();
   }


   async addMemberToOrganization(organizationId: string, memberIds: string[]): Promise<Organization | null> {
      return this.organizationModel.findOneAndUpdate({ _id: organizationId, isActive: true }, { $push: { members: { $each: memberIds } } }, { new: true }).exec();
   }

   async removeMemberFromOrganization(organizationId: string, memberIds: string[]): Promise<Organization | null> {
      return this.organizationModel.findOneAndUpdate({ _id: organizationId, isActive: true }, { $pull: { members: { $in: memberIds } } }, { new: true }).exec();
   }

   async getOrganizationMembers(organizationId: string): Promise<User[]> {
      const organization = await this.organizationModel.findOne({ _id: organizationId, isActive: true }).exec();
      if (!organization) {
         throw new NotFoundException('Organization not found');
      }
      return this.userModel.find({ _id: { $in: organization.members } }).exec();
   }

}
