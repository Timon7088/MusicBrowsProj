import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
});
console.log("authClient loaded", import.meta.env.BASE_URL);
