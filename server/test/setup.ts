import mongoose from "mongoose";

// connect to the test database before all tests
before(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
});

// Clear data and disconnect after all tests
after(async () => {
  // Drop all collections to clear data
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
