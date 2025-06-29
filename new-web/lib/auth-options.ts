import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { httpClient } from "./http-client";
import { isErrorResponse } from "@/types/response";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        console.log("authorize", credentials);
        const { username, password } = credentials || {};
        if (!username || !password) {
          throw new Error("Username and password are required");
        }
        const res = (await httpClient.login(username, password));
        if (isErrorResponse(res)) {
             throw new Error(res.message || "Login failed");
        }
        console.log("authorize res", res);
        if (res.data) {
          return {
            id: res.data.id,
            name: res.data.username, 
            // email: res.data.email,
            accessToken: res.token.accessToken,
          }
        }
        throw new Error("Login failed");
        // const user = { id: 1, name: "User", email: "
      },
    }),
  ],
  callbacks: {
    jwt(params) {
      console.log("callback jwrt", params);
      const { token, user } = params;
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = user;
      if (token) {
        session.user = token;
      }
      console.log("session", session, token, user);
      console.log("token", token);
      console.log("user", user);
      return session;
    },
  },
};