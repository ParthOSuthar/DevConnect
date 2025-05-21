import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "USER";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: "ADMIN" | "USER";
    };
  }
}
