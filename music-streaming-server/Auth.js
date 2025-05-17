import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// חיבור ל־MongoDB
const client = new MongoClient("mongodb://localhost:27017/musicbrows");
const db = client.db();

// ייצוא auth ל־Express
export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
  },
});
