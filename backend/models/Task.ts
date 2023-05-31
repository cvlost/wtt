import { model, Schema, Types } from 'mongoose';
import User from './User';
import { ITask } from '../types';

const TaskSchema = new Schema<ITask>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: (id: Types.ObjectId) => User.findById(id),
      message: 'User does not exist',
    },
  },
  startedAt: String,
  finishedAt: String,
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
});

const Task = model<ITask>('Task', TaskSchema);

export default Task;
