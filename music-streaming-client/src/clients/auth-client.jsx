import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000/api/auth", // ⬅️ תיקון קריטי כאן
  plugins: [adminClient()]
});

console.log("authClient loaded", import.meta.env.BASE_URL);
