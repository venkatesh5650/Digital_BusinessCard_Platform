import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NeonGlass — Digital Business Cards",
    template: "%s | NeonGlass",
  },
  description:
    "Create stunning digital business cards that leave a lasting impression. Share your professional identity with a single tap — no app required.",
  keywords: [
    "digital business card",
    "virtual vcard",
    "online business card",
    "NFC card",
    "professional profile",
    "contact sharing",
    "NeonGlass",
  ],
  authors: [{ name: "NeonGlass" }],
  creator: "NeonGlass",
  metadataBase: new URL("https://neonglass.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neonglass.me",
    siteName: "NeonGlass",
    title: "NeonGlass — Digital Business Cards",
    description:
      "Create stunning digital business cards that leave a lasting impression. Share your professional identity with a single tap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeonGlass — Digital Business Cards",
    description:
      "Create stunning digital business cards that leave a lasting impression.",
    creator: "@neonglass",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080b12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
