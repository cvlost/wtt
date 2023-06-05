import { model, Schema, Types } from 'mongoose';
import User from './User';
import { IReport } from '../types';

const ReportSchema = new Schema<IReport>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      validate: {
        validator: (id: Types.ObjectId) => User.findById(id),
        message: 'User does not exist',
      },
    },
    startedAt: Date,
    startedAtMinutes: Number,
    finishedAt: Date,
    finishedAtMinutes: Number,
    timeSpent: Number,
    title: {
      type: String,
      required: true,
    },
    description: String,
    dateStr: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

ReportSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('startedAt') || this.isModified('finishedAt')) {
    this.startedAtMinutes = Math.round(this.startedAt.getTime() / 60_000);
    this.finishedAtMinutes = Math.round(this.finishedAt.getTime() / 60_000);
    this.timeSpent = this.finishedAtMinutes - this.startedAtMinutes;
    return next();
  }

  return next();
});

ReportSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Report = model<IReport>('Report', ReportSchema);

export default Report;
