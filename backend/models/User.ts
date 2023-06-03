import { HydratedDocument, Model, model, Schema } from 'mongoose';
import { IUser } from '../types';
import { hash, genSalt, compare } from 'bcrypt';

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, UserMethods>;
export type UserDocument = HydratedDocument<IUser, UserMethods>;

const SALT_WORK_FACTOR = 8;

const UserSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: ['director', 'manager', 'employee'],
    },
    avatar: String,
    employed: {
      type: Date,
      required: true,
    },
    birthDay: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['admin', 'user'],
    },
  },
  { versionKey: false },
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await genSalt(SALT_WORK_FACTOR);
  this.password = await hash(this.password, salt);

  return next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password) {
  return compare(password, this.password);
};

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
