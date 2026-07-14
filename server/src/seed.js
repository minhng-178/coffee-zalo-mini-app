require("dotenv").config();
const { connectDb } = require("./db");
const { categories, products, variants } = require("./seedData");

async function seed() {
  const db = await connectDb();

  for (const [name, docs] of Object.entries({ categories, products, variants })) {
    const collection = db.collection(name);
    await collection.deleteMany({});
    await collection.insertMany(docs);
    console.log(`Seeded ${docs.length} documents into "${name}"`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
