import User from '../models/User';
import { ICreateUserDto, IUpdateUserDto } from '../types';
import { BadRequest } from '../errors/errors';
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
  const { email } = dto;
  const candidate = await User.findOne({ email });

  if (candidate) throw new BadRequest('Email is already taken');

  return await User.create(dto);
};

export const updateOne = async (_id: string, dto: IUpdateUserDto) => {
  const user = await User.findById(_id);

  if (!user) throw new BadRequest('Cannot update non-existent user');

  await User.updateOne({ _id }, dto);

  if (dto.password) user.password = dto.password;

  return user.save();
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new BadRequest('Wrong email');

  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid) throw new BadRequest('Wrong password');

  return user;
};

export const deleteOne = async (_id: string) => {
  return User.deleteOne({ _id });
};
