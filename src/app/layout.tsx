import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Imprint — Digital Business Cards",
    template: "%s | Imprint",
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
    "Imprint",
  ],
  authors: [{ name: "Imprint" }],
  creator: "Imprint",
  metadataBase: new URL("https://imprint.cards"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imprint.cards",
    siteName: "Imprint",
    title: "Imprint — Digital Business Cards",
    description:
      "Create stunning digital business cards that leave a lasting impression. Share your professional identity with a single tap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imprint — Digital Business Cards",
    description:
      "Create stunning digital business cards that leave a lasting impression.",
    creator: "@imprint",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent theme flash — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
