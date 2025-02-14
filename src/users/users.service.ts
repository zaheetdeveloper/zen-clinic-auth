import { Injectable } from '@nestjs/common';
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
   await  this.userModel.create(createUserDto);
   return "success";
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


 async  loginUser(user: any) {
	try {
		const dbUser = await this.userModel.findOne({email: user.mail});
		return dbUser;
	} catch (error) {
		await this.userModel.create({
			email: user.mail,
			name: user.displayName,
			externalId: user.id,
		});
		const dbUser = await this.userModel.findOne({email: user.mail});
		return dbUser;
	}
}

}
