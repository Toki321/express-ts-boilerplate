// test/helpers/db.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongod: any;
async function connect() {
  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  await mongoose.connect(uri);
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

export { connect, closeDatabase, clearDatabase };
