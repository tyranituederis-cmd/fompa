import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SwRegister } from "@/components/sw-register";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "FOMPA — Forum OSIS MPK Purwakarta",
    template: "%s | FOMPA Purwakarta",
  },
  description:
    "Website resmi Forum OSIS MPK Purwakarta (FOMPA). Wadah Kolaborasi, Kepemimpinan, dan Sinergi Pelajar Kabupaten Purwakarta.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  openGraph: {
    title: "FOMPA — Forum OSIS MPK Purwakarta",
    description: "Wadah Kolaborasi, Kepemimpinan, dan Sinergi Pelajar Kabupaten Purwakarta.",
    images: ["/logo.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <SwRegister />
        </Providers>
      </body>
    </html>
  );
}
