import Report from '../models/Report';

export const getAll = async (user?: string) => {
  return Report.aggregate([
    { $match: user ? { user } : {} },
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
  // return Report.aggregate([
  //   { $match: user ? { user: new Types.ObjectId(user) } : {} },
  //   {
  //     $group: {
  //       _id: '$dateStr',
  //       reportsNumber: { $sum: 1 },
  //       totalTime: { $sum: { $subtract: [{ $toDate: '$finishedAt' }, { $toDate: '$startedAt' }] } },
  //     },
  //   },
  //   { $project: { _id: 0, dateStr: '$_id', reportsNumber: 1, totalTime: 1 } },
  // ]);
};

export const getByDate = async (user: string, dateStr: string) => {
  return Report.find({ $and: [{ user }, { dateStr }] });
};
//
// export const createOne = async (dto) => {
//   return Task.create(dto);
// };
//
// export const updateOne = async (updateDto, task: string) => {
//   return Task.updateOne({ _id: task }, updateDto);
// };
//
// export const deleteOne = async (user: string, date: string, task: string) => {
//   return Task.deleteOne({ _id: task });
// };
