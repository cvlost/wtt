import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Report from './models/Report';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('tokens');
    await db.dropCollection('reports');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const admin = await User.create({
    firstName: 'Jack',
    lastName: 'Black',
    password: '###333',
    email: 'jack@mail.com',
    phone: '+777-989-888',
    position: 'director',
    avatar: '/images/avatars/admin.jpg',
    employed: new Date('2020-10-10'),
    role: 'admin',
  });

  const [user1, user2, user3] = await User.create(
    {
      firstName: 'Kate',
      lastName: 'Wilson',
      password: '###333',
      email: 'kate@mail.com',
      phone: '+277-989-888',
      position: 'employee',
      avatar: '/images/avatars/manager1.jpg',
      employed: new Date('2020-12-14'),
    },
    {
      firstName: 'Daniel',
      lastName: 'Arson',
      password: '###333',
      email: 'daniel@mail.com',
      phone: '+599-888-777',
      position: 'manager',
      avatar: '/images/avatars/manager2.jpg',
      employed: new Date('2021-03-01'),
    },
    {
      firstName: 'Will',
      lastName: 'Smith',
      password: '###333',
      email: 'will@mail.com',
      phone: '+679-888-777',
      position: 'manager',
      avatar: '/images/avatars/manager3.jpg',
      employed: new Date('2022-05-23'),
    },
  );

  await Report.create(
    {
      user: admin._id,
      title: 'Admin report 1',
      dateStr: '2023-05-31',
      description: 'some description here',
      startedAt: new Date('2023-05-31T19:00:00.039Z'),
      finishedAt: new Date('2023-05-31T19:05:00.039Z'),
    },
    {
      user: admin._id,
      title: 'Admin report 1',
      dateStr: '2023-05-31',
      description: 'some description here',
      startedAt: new Date('2023-05-31T19:05:00.039Z'),
      finishedAt: new Date('2023-05-31T19:10:00.039Z'),
    },
    {
      user: admin._id,
      title: 'Admin report 2',
      dateStr: '2023-05-30',
      description: 'some description 2 here',
      startedAt: new Date('2023-05-30T19:05:57.039Z'),
      finishedAt: new Date('2023-05-30T19:06:57.039Z'),
    },
    {
      user: admin._id,
      title: 'Admin report 1',
      dateStr: '2023-05-29',
      description: 'some description 3 here',
      startedAt: new Date('2023-05-29T19:02:57.039Z'),
      finishedAt: new Date('2023-05-29T19:05:57.039Z'),
    },

    {
      user: user1._id,
      title: 'User 1 report 1',
      dateStr: '2023-05-29',
      description: 'some description 3 here',
      startedAt: new Date('2023-05-29T19:02:57.039Z'),
      finishedAt: new Date('2023-05-29T19:05:57.039Z'),
    },
    {
      user: user1._id,
      title: 'User 1 report 1',
      dateStr: '2023-06-01',
      description: 'some description 3 here',
      startedAt: new Date('2023-06-01T19:02:57.039Z'),
      finishedAt: new Date('2023-06-01T19:05:57.039Z'),
    },

    {
      user: user2._id,
      title: 'User 2 report 1',
      dateStr: '2023-05-29',
      description: 'some description 3 here',
      startedAt: new Date('2023-05-29T19:02:57.039Z'),
      finishedAt: new Date('2023-05-29T19:05:57.039Z'),
    },
    {
      user: user2._id,
      title: 'User 2 report 1',
      dateStr: '2023-06-01',
      description: 'some description 3 here',
      startedAt: new Date('2023-06-01T19:02:57.039Z'),
      finishedAt: new Date('2023-06-01T19:05:57.039Z'),
    },

    {
      user: user3._id,
      title: 'user 3 report 1',
      dateStr: '2023-05-29',
      description: 'some description 3 here',
      startedAt: new Date('2023-05-29T19:02:57.039Z'),
      finishedAt: new Date('2023-05-29T19:05:57.039Z'),
    },
  );

  await db.close();
};

run().catch(console.error);
