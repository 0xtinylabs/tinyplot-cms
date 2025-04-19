import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Kullanıcı Adı",
          type: "text",
          placeholder: "kullanıcı adınız",
        },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        // Burada gerçek kullanıcı doğrulama mantığı olmalı
        // Örnek olarak sabit kullanıcı bilgileri kullanıyoruz
        // Gerçek uygulamada veritabanından doğrulanmalı

        if (
          credentials?.username === "admin" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Özel login sayfası
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
