import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth"
import { sendRequest } from "@/utils/api"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token :JWT) {
       const refreshedTokens = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/refresh_token`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token?.refresh_token}`,
          },
        nextOption: {
            cache: 'no-store',
        }
        })
        console.log(refreshedTokens)
       if(refreshedTokens.code === 201){
        return {
            ...token,
            access_token: refreshedTokens.data.access_token,
            expires_in: Date.now() + refreshedTokens.data.expires_in * 1000,
            refresh_token: refreshedTokens.data.refresh_token ?? token.refreshToken,
            user:refreshedTokens.data.user,
            error : ""
          }
       }else{
        return {
            ...token,
            error: "RefreshAccessTokenError",
          }
       } 
}

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "TrungDev",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/signin`,
                    method: "POST",
                    body: { Email: credentials?.email, Password: credentials?.password }
                })
                if (res && res.data) {
                    return res.data as any
                } else {
                    throw new Error("can not login" as string)
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider !== "credentials") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/social_media`,
                    method: "POST",
                    body: {
                        Auth: account?.provider?.toLowerCase(),
                        Email: user.email
                    },
                })
                if (res.code === 201) {
                    token.access_token = res.data?.access_token;
                    token.refresh_token = res.data?.refresh_token;
                    token.expires_in = Date.now() + ((res.data.expires_in ?? -1) * 1000);
                    token.user = res.data.user;
                }
            }
            if (trigger === "update") {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/refresh_token`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token?.refresh_token}`,
                        },
                })
                if(res.code === 201){
                    token.access_token = res.data?.access_token;
                    token.refresh_token = res.data?.refresh_token;
                    token.expires_in = Date.now() + ((res.data.expires_in ?? -1) * 1000);
                    token.user = res.data.user;
               }else{
                    token.error = "RefreshAccessTokenError"
               } 
            }
            if (trigger === "signIn" && account?.provider === "credentials") {
                //@ts-ignore
                token.access_token = user.access_token
                //@ts-ignore
                token.refresh_token = user.refresh_token
                //@ts-ignore
                token.expires_in = Date.now() + ((user.expires_in ?? -1) * 1000);
                //@ts-ignore
                token.user = user.user
            }
            // if (Date.now() < token.expires_in) {
            //     return token
            // }
            // return refreshAccessToken(token)
            return token
        },
        session({ session, token, user }) {
            if (token) {
                session.access_token = token.access_token
                session.refresh_token = token.refresh_token
                session.error = token.error
                session.user = token.user
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin'
    }
}