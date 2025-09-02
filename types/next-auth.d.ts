import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    pharmacyAccess: string[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      pharmacyAccess: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    pharmacyAccess: string[];
  }
}
