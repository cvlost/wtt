import { model, Schema, Types } from 'mongoose';
import User from './User';
import { IToken } from '../types';

const TokenSchema = new Schema<IToken>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: (id: Types.ObjectId) => User.findById(id),
      message: 'Cannot save refresh token - user does not exist',
    },
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

const Token = model<IToken>('Token', TokenSchema);

export default Token;
