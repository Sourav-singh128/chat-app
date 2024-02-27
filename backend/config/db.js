const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://ssguggutor128:Dabeli128@cluster0.wpytuo5.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`connection has been made with ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error is ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
