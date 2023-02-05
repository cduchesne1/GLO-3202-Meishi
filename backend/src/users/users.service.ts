import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
      profile: {
        title: '',
        bio: '',
        picture: '',
        links: [],
      },
    });

    return createdUser.save();
  }

  async updateProfile(
    user: User,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const newProfile = {
      title:
        updateProfileDto.title === null || updateProfileDto.title === undefined
          ? user.profile.title
          : updateProfileDto.title,
      bio:
        updateProfileDto.bio === null || updateProfileDto.bio === undefined
          ? user.profile.bio
          : updateProfileDto.bio,
      picture:
        updateProfileDto.picture === null ||
        updateProfileDto.picture === undefined
          ? user.profile.picture
          : updateProfileDto.picture,
      links:
        updateProfileDto.links === null || updateProfileDto.links === undefined
          ? user.profile.links
          : updateProfileDto.links,
    };
    await this.userModel.updateOne(
      // eslint-disable-next-line no-underscore-dangle
      { _id: user._id },
      { $set: { profile: newProfile } },
    );
  }
}
