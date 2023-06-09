import Report from '../models/Report';
import { Types } from 'mongoose';
import { ICreateReportDto } from '../types';
import User from '../models/User';
import { BadRequest } from '../errors/errors';
import dayjs, { Dayjs } from 'dayjs';

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
        timeSpent: 1,
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
            user: '$user',
            startedAt: '$startedAt',
            finishedAt: '$finishedAt',
            timeSpent: '$timeSpent',
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
        pipeline: [{ $set: { id: '$_id' } }, { $project: { _id: 0, password: 0 } }],
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
  return Report.findById(_id);
};

export const createOne = async (dto: ICreateReportDto) => {
  return Report.create(dto);
};

export const updateOne = async (_id: string, dto: ICreateReportDto) => {
  const report = await Report.findById(_id);

  if (!report) throw new BadRequest('Cannot update non-existent report');

  await Report.updateOne({ _id }, dto);

  if (report.startedAt) report.startedAt = new Date(dto.startedAt);
  if (report.finishedAt) report.finishedAt = new Date(dto.finishedAt);

  return report.save();
};

export const deleteOne = async (_id: string) => {
  return Report.deleteOne({ _id });
};

export const deleteMany = async (user: string) => {
  return Report.deleteMany({ user });
};

export const getAllowedDates = () => {
  const today = dayjs();
  const dates: Dayjs[] = [today];

  for (let i = 0; i < 2; i++) {
    let prevDay = dates[i].subtract(1, 'day');
    while (prevDay.day() === 0 || prevDay.day() === 6) {
      prevDay = prevDay.subtract(1, 'day');
    }
    dates.push(prevDay);
  }

  if (today.day() === 0 || today.day() === 6) dates.shift();

  return dates.map((date) => date.format('YYYY[-]MM[-]DD'));
};

export const isAllowedDate = (dateStr: string) => {
  return getAllowedDates().includes(dateStr);
};
