import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable');
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

export const clientPromise =
  global.mongoClientPromise || client.connect();

if (process.env.NODE_ENV !== 'production') {
  global.mongoClientPromise = clientPromise;
}

let indexesCreated = false;

export const getDb = async () => {
  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB || process.env.DB_NAME);
  if (!indexesCreated) {
    indexesCreated = true;
    // Enforce unique indexing on users email
    db.collection('user').createIndex({ email: 1 }, { unique: true }).catch(err => {
      console.warn('Failed to create unique index on user email:', err);
    });
  }
  return db;
};

