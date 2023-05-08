import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const memoryDb = MongoMemoryServer.create();

export const connect = async () => {
  const uri = (await memoryDb).getUri();
  await mongoose.connect(uri);
};

export const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await memoryDb).stop();
};

export const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
