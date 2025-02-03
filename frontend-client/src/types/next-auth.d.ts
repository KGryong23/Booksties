import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
interface IUser {
    userId: string,
    email: string,
    authMethod: string,
    isActive: boolean,
    roleName: string,
    address:string,
    reputation:string
}
declare module "next-auth/jwt" {
    interface JWT {
        access_token: string,
        refresh_token: string,
        expires_in: number,
        error:string,
        user: IUser
    }
}
declare module "next-auth" {
    interface Session {
        access_token: string,
        refresh_token: string,
        expires_in: number,
        error:string,
        user: IUser
    }

}