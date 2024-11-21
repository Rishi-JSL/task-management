import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { IGetAllUsersResponse } from 'src/common/interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: User): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async getAllUsers(): Promise<IGetAllUsersResponse> {
    const users = (await this.userModel
      .find({}, { _id: false, __v: false })
      .exec()) as User[];
    return { data: { users } };
  }

  async findUser(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async isUserExist(email: string) {
    const user = await this.findUser(email);
    return user ? true : false;
  }
}
