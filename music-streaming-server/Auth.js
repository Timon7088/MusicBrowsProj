import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient("mongodb://localhost:27017/musicbrows");
const db = client.db();

export const auth = betterAuth({
  plugins: [
    admin()
  ],

  user: {
    additionalFields: {
      likedSongs: {
        type: "string[]",
        nullable: true
      },
      role: {
        type: "string",
        enum: ["user", "admin"],
        default: "user"          
      }
    },
    deleteUser: { 
      enabled: true
  } 
  },

  database: mongodbAdapter(db),

  trustedOrigins: ["http://localhost:5173"],

  emailAndPassword: {
    enabled: true
  }
});
