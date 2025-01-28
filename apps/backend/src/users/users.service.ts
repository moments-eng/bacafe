import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cursor, Model, QueryOptions, Unpacked } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllPaginated(page: number, pageSize: number): Promise<User[]> {
    return this.userModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByDigestHour(hour: string): Promise<User[]> {
    return this.userModel.find({ digestTime: hour }).exec();
  }

  async updatePreferences(id: string, preferences: any[]): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { preferences }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateDigestTime(id: string, digestTime: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { digestTime }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  getUserCursor(): Cursor<Unpacked<UserDocument>, QueryOptions<UserDocument>> {
    return this.userModel.find().cursor();
  }
}
