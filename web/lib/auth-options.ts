import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { httpClient } from './http-client';
import { isErrorResponse } from '@/types/response';

// Extend the User and Session types to include accessToken
declare module 'next-auth' {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
    user?: User;
  }
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/sign-in'
  },
  session: {
    // strategy: "jwt",
    maxAge: 60 * 60 //
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },

      async authorize(credentials) {
        // console.log("authorize", credentials);
        const { username, password } = credentials || {};
        if (!username || !password) {
          throw new Error('Username and password are required');
        }
        const res = await httpClient.login(username, password);
        if (isErrorResponse(res)) {
          throw new Error(res.message || 'Login failed');
        }
        // console.log("authorize res", res);
        if (res.data) {
          return {
            id: res.data.id,
            name: res.data.username,
            // email: res.data.email,
            accessToken: res.token.accessToken
          };
        }
        throw new Error('Login failed');
        // const user = { id: 1, name: "User", email: "
      }
    })
  ],
  callbacks: {
    jwt(params) {
      // console.log("callback jwrt", params);
      const { token, user } = params;
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken; // Assuming user has accessToken
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = user;
      // if (token) {
      //     session.user = token;
      // }
      const accessToken = token.accessToken as string | undefined;
      if (accessToken) {
        session.accessToken = accessToken;
        if (session.user) {
          session.user.accessToken = accessToken;
        }
      }
      // console.log("session", session, token, user);
      if (!session.user && token.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token.user as any; // Ensure user is set in session
      }
      // console.log("token", token);
      // console.log("user", user);
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', { user, account, profile, email, credentials });
      return true;
    }
  }
};
