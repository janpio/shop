import NextAuth from "next-auth";
import { authOptions } from "src/shared/libs/auth";

const handler = NextAuth(authOptions);

export default handler;
