import Report from '../models/Report';
import { Types } from 'mongoose';
import { ICreateReportDto } from '../types';
import User from '../models/User';

export const getAll = async (user?: string) => {
  return Report.aggregate([
    { $match: user ? { user: new Types.ObjectId(user) } : {} },
    {
      $project: {
        dateStr: 1,
        minutes: {
          $range: ['$startedAtMinutes', '$finishedAtMinutes'],
        },
      },
    },
    {
      $group: {
        _id: '$dateStr',
        count: { $sum: 1 },
        _temp: {
          $push: '$minutes',
        },
        dateStr: {
          $first: '$dateStr',
        },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        dateStr: '$_id',
        totalTime: {
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
  ]);
};

export const getByDate = async (user: string, dateStr: string) => {
  const report = await Report.findOne({ user, dateStr });

  if (!report)
    return {
      dateStr,
      user: await User.findById(user),
      totalTime: 0,
      reports: [],
    };

  const [dayReport] = await Report.aggregate([
    { $match: { $and: [{ user: new Types.ObjectId(user) }, { dateStr }] } },
    {
      $project: {
        user: 1,
        dateStr: 1,
        startedAt: 1,
        finishedAt: 1,
        title: 1,
        description: 1,
        minutes: {
          $range: ['$startedAtMinutes', '$finishedAtMinutes'],
        },
      },
    },
    {
      $group: {
        _id: '$user',
        _temp: {
          $push: '$minutes',
        },
        dateStr: {
          $first: '$dateStr',
        },
        reports: {
          $push: {
            id: '$_id',
            startedAt: '$startedAt',
            finishedAt: '$finishedAt',
            title: '$title',
            description: '$description',
          },
        },
        totalTime: {
          $sum: {
            $subtract: ['$finishedAt', '$startedAt'],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        dateStr: 1,
        user: '$user',
        reports: 1,
        totalTime: {
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
  ]);

  return dayReport;
};

export const getOne = async (_id: string) => {
  return Report.find({ _id });
};

export const createOne = async (dto: ICreateReportDto) => {
  return Report.create(dto);
};
//
// export const updateOne = async (updateDto, task: string) => {
//   return Task.updateOne({ _id: task }, updateDto);
// };
//
// export const deleteOne = async (user: string, date: string, task: string) => {
//   return Task.deleteOne({ _id: task });
// };
