import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email, isActive: true });
      if (existingUser) {
        throw new BadGatewayException("User already exists");
      }
      return await this.userModel.create(createUserDto);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadGatewayException("User not found");
    }
    user.isActive = false;
    await user.save();
    return user;
  }


  async loginUser(user: any) {
    try {
      const dbUser = await this.userModel.findOne({ email: user.mail });
      return dbUser;
    } catch (error) {
      await this.userModel.create({
        email: user.mail,
        name: user.displayName,
        externalId: user.id,
      });
      const dbUser = await this.userModel.findOne({ email: user.mail });
      return dbUser;
    }
  }

  async getUserByUserId(userId: string) {
    const t = await this.userModel.findOne({ userId });
    return t
  }

}
