import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "errorLogger",
    });

    isConnected = true;
    console.log("=> using new database connection");
  } catch (error) {
    console.log(error);
    // process.exit(1);
  }
};
