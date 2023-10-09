const mongoose = require('mongoose');

// connect to the test database before all tests
before(async () => {
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear data and disconnect after all tests
after(async () => {
  // Drop all collections to clear data
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});