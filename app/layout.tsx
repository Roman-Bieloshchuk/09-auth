import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient application for managing personal notes.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application preview",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />

            {children}

            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
