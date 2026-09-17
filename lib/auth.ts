import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAdminClient } from "./supabase/admin";

/**
 * Konfigurasi NextAuth: Credentials (email + password) dengan JWT.
 * Role & data pengurus disimpan ke dalam token sesi.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();
        const supabase = getAdminClient();

        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, name, password_hash, avatar_url, status, roles(name)")
          .eq("email", email)
          .maybeSingle();

        if (error || !user || user.status !== "active") return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
          role: (user.roles as { name: string }[] | null)?.[0]?.name ?? "pengurus",
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "pengurus";
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.uid = token.uid as string;
      }
      return session;
    },
  },
};

/** Helper: ambil sesi di server */
export function getSession() {
  return getServerSession(authOptions);
}
