import Report from '../models/Report';
import { Types } from 'mongoose';
import { ICreateReportDto } from '../types';

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
  return Report.find({ $and: [{ user }, { dateStr }] });
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
