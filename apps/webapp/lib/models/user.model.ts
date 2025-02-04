import {
  Severity,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import type { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import type {
  BeAnObject,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types";
import mongoose from "mongoose";

import { ArticleDto } from "@/generated/http-clients/backend";

export type PreferredArticle = Required<
  Pick<
    ArticleDto,
    | "title"
    | "subtitle"
    | "content"
    | "enrichment"
    | "description"
    | "categories"
    | "author"
  >
>;

enum UserGender {
  MALE = "male",
  FEMALE = "female",
  NOT_SPECIFIED = "notSpecified",
}

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@pre<User>("save", function () {
  this.updatedAt = new Date();
})
@index({ approved: 1 })
@index({ createdAt: 1 })
@index({ role: 1 })
export class User implements TimeStamps {
  _id!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop()
  public image?: string;

  @prop({ min: 13, max: 120 })
  public age?: number;

  @prop({ default: false })
  public isOnboardingDone!: boolean;

  @prop({ enum: UserGender, default: UserGender.NOT_SPECIFIED })
  public gender?: UserGender;

  @prop({ required: true, default: "08:00" })
  public digestTime?: string;

  @prop({ type: () => [Object], default: [] })
  public preferences?: PreferredArticle[];

  @prop({ enum: UserRole, default: UserRole.USER, required: true })
  public role!: UserRole;

  @prop({ default: false, required: true })
  public approved!: boolean;

  @prop({ type: () => Object })
  public enrichment?: Record<string, unknown>;

  @prop({ type: () => [Number], default: [] })
  public embeddings!: number[];

  @prop({ default: Date.now })
  public createdAt!: Date;

  @prop({ default: Date.now })
  public updatedAt!: Date;

  @prop({ required: true, default: "whatsapp" })
  public digestChannel!: "email" | "whatsapp";

  @prop({ match: /^05\d{8}$/ })
  public phoneNumber?: string;
}

export const UserModel =
  (mongoose.models.User as ReturnModelType<typeof User, BeAnObject>) ||
  getModelForClass(User);
