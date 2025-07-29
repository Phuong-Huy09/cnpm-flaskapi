process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
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

    if (!response.ok || !refreshed.access_token) {
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
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      tokenExpiry: Date.now() + (refreshed.expires_in * 1000 || 3600 * 1000),
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
          // const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     "Accept": "application/json"
          //   },
          //   body: JSON.stringify({
          //     email: credentials.email,
          //     password: credentials.password,
          //   }),
          // });

          // const loginData = await loginRes.json();

          // if (!loginRes.ok || !loginData?.access_token) {
          //   console.error("🔴 Login failed:", loginData);
          //   return null;
          // }

          // const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          //   method: "POST",
          //   headers: {
          //     "Authorization": `Bearer ${loginData.access_token}`,
          //     "Accept": "application/json"
          //   },
          // });

          // const userData = await userRes.json();

          // if (!userRes.ok || !userData?.id || !userData?.email) {
          //   console.error("🔴 User info fetch failed:", userData);
          //   return null;
          // }
          console.log("login credentials:", credentials);
          return {
            id: "12345", // Replace with actual user ID from userData
            name: credentials.email, // Replace with actual user name from userData
            email: credentials.email, // Replace with actual user email from userData
          }
          return {
            id: userData.id,
            name: userData.name ?? userData.email,
            email: userData.email,
            accessToken: loginData.access_token,
            refreshToken: loginData.refresh_token ?? null,
            tokenExpiry: Date.now() + (loginData.expires_in * 1000 || 3600 * 1000),
          };
        } catch (err) {
          console.error("🔥 Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔵 JWT Callback:", { token });
      if (user) {
        return {
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

      const isExpired = token.tokenExpiry ? Date.now() >= token.tokenExpiry : true;

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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.tokenExpiry = token.tokenExpiry;
      session.user = token.user;
      session.error = token.error ?? null;
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      // Optional: Log hoặc thống kê
    },
    async signOut() {
      // Optional: Clear token phía backend nếu cần
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
