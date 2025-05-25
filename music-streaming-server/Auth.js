import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient("mongodb://localhost:27017/musicbrows");
const db = client.db();

export const auth = betterAuth({

  user: {
    additionalFields: {
      likedSongs: {
        type: "string[]",
        nullable: true
      }
    }
  },

  database: mongodbAdapter(db),
  trustedOrigins: ["http://localhost:5173"], // כתובת הלקוח שלך
  emailAndPassword: { enabled: true },
});
