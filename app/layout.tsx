import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PasteAnywhere - Share Clipboard Across Devices",
  description: "Copy on one device, paste on any other. Instant cross-device clipboard sharing via QR codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
