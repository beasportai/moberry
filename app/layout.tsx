import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientContextWrapper from "@/context/client-context-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moberry Blueberry",
  description: "Tastiest Blueberries ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-[var(--primary-bg)] ${geistMono.variable} antialiased`}
      >
        <ClientContextWrapper>
          <Navbar />
          <div className="flex flex-col gap-2 wrapper">{children}</div>
          <Footer />
        </ClientContextWrapper>
      </body>
    </html>
  );
}
