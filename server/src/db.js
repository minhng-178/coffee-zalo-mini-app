const { MongoClient } = require("mongodb");

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set (see .env.example)");
}

let client;
let db;

async function connectDb() {
  if (db) return db;
  client = new MongoClient(DATABASE_URL);
  await client.connect();
  db = client.db();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error("Database not connected yet — call connectDb() first");
  }
  return db;
}

module.exports = { connectDb, getDb };
