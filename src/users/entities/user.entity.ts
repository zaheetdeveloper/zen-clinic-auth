import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserRoleEnum } from 'src/shared/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: false, maxlength: 1000 })
  userName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  note?: string;

  @Prop({ required: false, type: [String], enum: Object.values(UserRoleEnum) })
  roles?: UserRoleEnum[];

  @Prop({ required: false, default: false })
  isActive?: boolean;

  @Prop({ required: false, default: false })
  userId?: string;



  @Prop({ required: false, default: false })
  defaultRole?: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
