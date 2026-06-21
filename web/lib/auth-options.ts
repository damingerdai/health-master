import { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { httpClient } from './http-client';
import { DataResponse, isErrorResponse, TokenResponse } from '@/types/response';
import { getCurrentUser } from '@/components/actions/user';
import { AccessToken } from '@/types/token';

// Extend the User and Session types to include accessToken
declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;
    gender?: string;
    accessToken?: string;

    needTwoFactor?: boolean;
    challengeToken?: string;
  }
  interface Session {
    accessToken?: string;
    user?: User;
    needTwoFactor?: boolean;
    challengeToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;

    accessToken?: string;

    needTwoFactor?: boolean;
    challengeToken?: string;
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
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },

      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          throw new Error('Login failed');
        }
        const tokenRes: DataResponse<{ needTwoFactor: true, challengeToken: string } | { needTwoFactor: false, token: AccessToken }> = await res.json();
        if (isErrorResponse(tokenRes)) {
          throw new Error(tokenRes.message || 'Login failed');
        }
        const tokenData = tokenRes.data;
        if (tokenData.needTwoFactor) {
          // Handle two-factor authentication flow
          return {
            needTwoFactor: true,
            challengeToken: tokenData.challengeToken
          } as User;
        }
        console.log('tokenRes', tokenRes.data);
        const { accessToken } = tokenData.token;
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userRes.json();
        if (isErrorResponse(userData)) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
        return {
          id: userData.data.id,
          username: userData.data.username,
          firstName: userData.data.firstName,
          lastName: userData.data.lastName,
          email: userData.data.email,

          accessToken: accessToken,
          needTwoFactor: false
        } as User;
      }
    }),
    CredentialsProvider({
      id: '2fa',
      name: 'TwoFactor',
      credentials: {
        code: {
          label: 'Code',
          type: 'text'
        },
        challengeToken: {
          label: 'Challenge Token',
          type: 'text'
        }
      },
      async authorize(credentials) {
        const { code, challengeToken } = credentials || {};
        if (!code || !challengeToken) {
          throw new Error('Code and challenge token are required');
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/auth/2fa`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, challengeToken })
        });
        if (!res.ok) {
          throw new Error('Two-factor authentication failed');
        }
        const tokenRes: DataResponse<{ token: AccessToken }> = await res.json();
        if (isErrorResponse(tokenRes)) {
          throw new Error(tokenRes.message || 'Two-factor authentication failed');
        }
        const { accessToken } = tokenRes.data.token;
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!userRes.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userRes.json();
        if (isErrorResponse(userData)) {
          throw new Error(userData.message || 'Failed to fetch user data');
        }
        return {
          id: userData.data.id,
          username: userData.data.username,
          firstName: userData.data.firstName,
          lastName: userData.data.lastName,
          email: userData.data.email,

          accessToken: accessToken,
          needTwoFactor: false
        } as User;
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
        token.needTwoFactor = user.needTwoFactor;
        token.challengeToken = user.challengeToken;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.needTwoFactor = token.needTwoFactor;
      session.challengeToken = token.challengeToken;

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', { user, account, profile, email, credentials });
      return true;
    }
  }
};
