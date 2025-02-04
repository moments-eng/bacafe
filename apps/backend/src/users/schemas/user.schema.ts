import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaOptions, Types } from 'mongoose';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  NOT_SPECIFIED = 'notSpecified',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserDocument = User & Document;

const schemaOptions: SchemaOptions = {
  timestamps: true,
  collection: 'users',
};

@Schema(schemaOptions)
export class User {
  @ApiProperty({ description: 'User ID' })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image?: string;

  @Prop({ min: 13, max: 120 })
  age?: number;

  @Prop({ default: false })
  isOnboardingDone: boolean;

  @Prop({ enum: UserGender, default: UserGender.NOT_SPECIFIED })
  gender?: UserGender;

  @Prop({ required: true, default: '08:00' })
  digestTime: string;

  @Prop({ type: [Object], default: [] })
  preferences: Array<Record<string, any>>;

  @Prop({ enum: UserRole, default: UserRole.USER, required: true })
  role: UserRole;

  @Prop({ default: false, required: true })
  approved: boolean;

  @Prop({ type: Object })
  enrichment?: Record<string, unknown>;

  @Prop({ type: [Number], default: [] })
  embeddings: number[];

  @Prop({ required: true, default: 'whatsapp' })
  digestChannel: 'email' | 'whatsapp';

  @Prop({ match: /^05\d{8}$/ })
  phoneNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes after schema creation
UserSchema.index({ digestTime: 1 });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ approved: 1 });
