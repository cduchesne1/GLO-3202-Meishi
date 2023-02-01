import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionModule } from '../encryption/encryption.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EncryptionModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
