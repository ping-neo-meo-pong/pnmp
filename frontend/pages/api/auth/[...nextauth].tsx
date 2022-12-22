import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import FortyTwoProvider from 'next-auth/providers/42-school';
import GitHubProvider from "next-auth/providers/github";

export const options : NextAuthOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET
        }),
        FortyTwoProvider({
            clientId: process.env.FORTY_TWO_CLIENT_ID,
            clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
        }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token
        }
        return token
      },
      async session({ session, token, user }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken
        return session
      }
    },
    debug: true,
}

export default NextAuth(options)
