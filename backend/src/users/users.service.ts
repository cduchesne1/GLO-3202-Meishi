import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username });

    return user !== null;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const createdUser = new this.userModel({
      username,
      email,
      password: await this.encryptionService.hash(password),
    });

    return createdUser.save();
  }
}
