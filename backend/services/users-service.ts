import User from '../models/User';
import { ICreateUserDto, IUpdateUserDto } from '../types';
import { NotFound, ValidationFailed } from '../errors/errors';
import { PipelineStage, Types } from 'mongoose';
import dayjs from 'dayjs';

const nullishActivity = { count: 0, time: 0 };
const today = dayjs().format('YYYY[-]MM[-]DD');
const userActivityPipelines: PipelineStage[] = [
  {
    $lookup: {
      from: 'reports',
      let: { userId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
        {
          $facet: {
            dayActivity: [
              { $match: { dateStr: today } },
              { $project: { minutes: { $range: ['$startedAtMinutes', '$finishedAtMinutes'] } } },
              { $group: { _id: null, count: { $sum: 1 }, _temp: { $push: '$minutes' } } },
              {
                $project: {
                  _id: 0,
                  count: 1,
                  time: {
                    $size: {
                      $reduce: {
                        input: '$_temp',
                        initialValue: [],
                        in: {
                          $setUnion: ['$$value', '$$this'],
                        },
                      },
                    },
                  },
                },
              },
            ],
            overallActivity: [
              { $project: { dateStr: 1, minutes: { $range: ['$startedAtMinutes', '$finishedAtMinutes'] } } },
              { $group: { _id: '$dateStr', count: { $sum: 1 }, _temp: { $push: '$minutes' } } },
              {
                $addFields: {
                  time: {
                    $size: {
                      $reduce: {
                        input: '$_temp',
                        initialValue: [],
                        in: {
                          $setUnion: ['$$value', '$$this'],
                        },
                      },
                    },
                  },
                },
              },
              { $group: { _id: null, time: { $sum: '$time' }, count: { $sum: '$count' } } },
              { $project: { _id: 0, count: 1, time: 1 } },
            ],
          },
        },
      ],
      as: 'reports',
    },
  },
  {
    $addFields: {
      dayActivity: { $ifNull: [{ $first: { $first: '$reports.dayActivity' } }, nullishActivity] },
      overallActivity: { $ifNull: [{ $first: { $first: '$reports.overallActivity' } }, nullishActivity] },
      id: '$_id',
    },
  },
  { $project: { reports: 0, password: 0, _id: 0 } },
];

export const getAll = async () => {
  return User.aggregate(userActivityPipelines);
};

export const getOne = async (_id: string) => {
  const [user] = await User.aggregate([{ $match: { _id: new Types.ObjectId(_id) } }, ...userActivityPipelines]);

  return user;
};

export const findById = async (id: string | Types.ObjectId) => {
  return User.findById(id);
};

export const create = async (dto: ICreateUserDto) => {
  return await User.create(dto);
};

export const updateOne = async (_id: string, dto: IUpdateUserDto) => {
  const user = await User.findById(_id);

  if (!user) throw new NotFound('Cannot update non-existent user');

  await User.updateOne({ _id }, dto);

  if (dto.password) user.password = dto.password;

  return user.save();
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new ValidationFailed('Wrong email or password');

  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid) throw new ValidationFailed('Wrong email or password');

  return user;
};

export const deleteOne = async (_id: string) => {
  const user = await User.findById(_id);

  if (!user) throw new NotFound();

  return User.deleteOne({ _id });
};
