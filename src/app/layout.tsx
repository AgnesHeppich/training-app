import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pull-Up Mastery",
  description: "8-Week Pull-Up Training Program",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pull-Up Mastery",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body>
        <div className="app-background" />

        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
