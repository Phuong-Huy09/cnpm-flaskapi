import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import { SessionProvider } from "next-auth/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "On Demand Tutor - Nền tảng tìm gia sư theo yêu cầu",
  description: "Kết nối học sinh với gia sư chất lượng. Học tập cá nhân hóa với giá cả hợp lý và hỗ trợ ngay lập tức.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster closeButton richColors position="top-right" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
