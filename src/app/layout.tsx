import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const siteUrl = "https://soulmates.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Soulmates — páginas de regalo con contador en vivo",
    template: "%s · Soulmates",
  },
  description:
    "Creá en minutos una página de regalo con contador en vivo, mensaje y QR — para pareja, amigos, familia o mascota. Sin apps, sin cuentas para verla.",
  openGraph: {
    title: "Soulmates",
    description: "Una página con su historia, lista para regalar — con QR incluido.",
    type: "website",
    locale: "es_AR",
    url: siteUrl,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon-180.png",
  },
};

export const viewport = {
  themeColor: "#1B1220",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ground text-text">{children}</body>
    </html>
  );
}
