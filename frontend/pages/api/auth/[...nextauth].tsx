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
            clientSecret: process.env.FORTY_TWO_CLIENT_SECRET
        }),
    ],
      debug: true,
}

export default NextAuth(options)
