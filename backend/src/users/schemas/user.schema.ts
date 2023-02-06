import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class Link {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  url: string;
}

@Schema()
export class Profile {
  @Prop()
  title: string;

  @Prop()
  bio: string;

  @Prop()
  picture: string;

  @Prop()
  links: Link[];
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
