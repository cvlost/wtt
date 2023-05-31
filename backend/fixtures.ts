import mongoose from 'mongoose';
import config from './config';
import User from './models/User';

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('tokens');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const admin = await User.create({
    firstName: 'Jack',
    lastName: 'Black',
    password: '###333',
    email: 'jack@mail.com',
    phone: ['+999-888-777', '+777-989-888'],
    position: 'Director',
    avatar: '/images/avatars/admin.jpg',
    employed: new Date('2020-10-10'),
    role: 'ADMIN',
  });

  const [user1, user2, user3] = await User.create(
    {
      firstName: 'Kate',
      lastName: 'Wilson',
      password: '###333',
      email: 'kate@mail.com',
      phone: ['+199-888-777', '+277-989-888', '+377-989-888'],
      position: 'Manager',
      avatar: '/images/avatars/manager1.jpg',
      employed: new Date('2020-12-14'),
    },
    {
      firstName: 'Daniel',
      lastName: 'Arson',
      password: '###333',
      email: 'daniel@mail.com',
      phone: ['+599-888-777'],
      position: 'Manager',
      avatar: '/images/avatars/manager2.jpg',
      employed: new Date('2021-03-01'),
    },
    {
      firstName: 'Will',
      lastName: 'Smith',
      password: '###333',
      email: 'will@mail.com',
      phone: ['+679-888-777', '+877-989-888'],
      position: 'Manager',
      avatar: '/images/avatars/manager3.jpg',
      employed: new Date('2022-05-23'),
    },
  );

  await db.close();
};

run().catch(console.error);
