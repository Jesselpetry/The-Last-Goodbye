import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Last Goodbye",
  description: "จดหมายลาก่อนสำหรับเพื่อนๆ ของฉัน - A digital farewell letter platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-grid">
        {children}
      </body>
    </html>
  );
}
