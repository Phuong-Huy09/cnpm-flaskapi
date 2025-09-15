process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
    user: {
      id: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
    error?: string | null;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | null;
    refreshToken?: string | null;
    tokenExpiry?: number;
    user?: {
      id: string;
      name?: string;
      email?: string;
    };
    error?: string;
  }
}

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        refresh_token: token.refreshToken
      }),
    });

    const refreshed = await response.json();

    if (!response.ok || !refreshed?.success || !refreshed?.data?.access_token) {
      console.error("🔴 REFRESH FAIL", {
        status: response.status,
        body: refreshed,
      });
      console.error("🔴 REFRESH FAIL", {
        oldAccessToken: token.accessToken,
        oldRefreshToken: token.refreshToken,
      });
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: refreshed.data.access_token,
      refreshToken: refreshed.data.refresh_token ?? token.refreshToken,
      tokenExpiry: Date.now() + (3600 * 1000), // 1 hour default
    };
  } catch (err) {
    console.error("🔴 RefreshAccessTokenError:", err);
    return {
      ...token,
      accessToken: null,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
    authorize: async (credentials) => {
      try {
        if (!credentials?.email || !credentials?.password) return null;

        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        let loginData: any = null;
        try { loginData = await loginRes.json(); } catch { /* body rỗng -> fail */ }

        // CHỈ thành công khi: HTTP 2xx && success === true && có access_token
        const ok = loginRes.ok && loginData?.success === true && loginData?.data?.access_token;
        if (!ok) {
          console.error("🔴 Login failed", { status: loginRes.status, body: loginData });
          return null; // Quan trọng: trả null để NextAuth hiểu là thất bại
        }

        const user = loginData.data.user;
        if (!user?.id || !user?.email) return null;

        return {
          id: String(user.id),
          name: user.username ?? user.email,
          email: user.email,
          accessToken: loginData.data.access_token,
          refreshToken: loginData.data.refresh_token ?? null,
          tokenExpiry: Date.now() + 3600_000,
        };
      } catch (e) {
        console.error("🔥 Authorize error", e);
        return null; // luôn null khi có exception
      }
    }

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔵 JWT Callback:", { token });
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          tokenExpiry: user.tokenExpiry,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      }

      // Check if token has expired
      const tokenExpiry = token.tokenExpiry as number | undefined;
      const isExpired = tokenExpiry ? Date.now() >= tokenExpiry : true;

      if (!token.accessToken || isExpired) {
        if (token.refreshToken) {
          const refreshed = await refreshAccessToken(token);
          return {
            ...refreshed,
            user: token.user, // preserve user info
          };
        }

        return {
          ...token,
          accessToken: null,
          error: "NoRefreshTokenAvailable",
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.tokenExpiry = token.tokenExpiry;
      
      // Ensure the user object is properly structured
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email || "",
          // role: token.user.role || "",
        };
      }
      
      session.error = token.error ?? null;
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      // Optional: Log or statistics
      console.log("User signed in:", user.email);
    },
    async signOut() {
      // Optional: Clear backend token if needed
      console.log("User signed out");
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.DEBUG === "true",
});
