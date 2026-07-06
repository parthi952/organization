const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../NODE/.env') });

const mongoURI = process.env.mongoDB;
if (!mongoURI) {
  console.error("MongoDB URI not found in env!");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to Database successfully!');
    const db = mongoose.connection.db;

    // Find the user named 'raja' in the 'orgdatas' collection
    const user = await db.collection('orgdatas').findOne({ Name: 'raja' });
    if (!user) {
      console.error("User 'raja' not found in orgdatas!");
      process.exit(1);
    }
    console.log("Found User 'raja' with ID:", user._id);

    // Update the flag named 'exam' to set created_by to raja's ID
    const result = await db.collection('flags').updateOne(
      { Flag_Name: 'exam' },
      { $set: { created_by: user._id } }
    );

    console.log(`Matched ${result.matchedCount} flag(s) and updated ${result.modifiedCount} flag(s).`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error connecting or updating:", err);
    process.exit(1);
  });
