import {
	prop,
	getModelForClass,
	modelOptions,
	pre,
	mongoose,
} from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export type Gender = 'male' | 'female' | 'notSpecified';

@modelOptions({
	schemaOptions: {
		timestamps: true,
		collection: 'users',
	},
})
@pre<User>('save', function () {
	this.updatedAt = new Date();
})
export class User extends TimeStamps {
	@prop({ required: true, unique: true })
	public auth0Id!: string;

	@prop({ required: true })
	public email!: string;

	@prop({ required: true })
	public name!: string;

	@prop()
	public picture?: string;

	@prop({ min: 13, max: 120 })
	public age?: number;

	@prop({ type: () => [String], default: [] })
	public interests?: string[];

	@prop({ default: false })
	public isOnboardingDone!: boolean;

	@prop({ enum: ['male', 'female', 'notSpecified'], default: 'notSpecified' })
	public gender?: Gender;

	@prop({ required: true, default: '08:00' })
	public digestTime?: string;
}

export const UserModel = mongoose.models.User || getModelForClass(User);
