import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Mali } from "next/font/google";
import "./globals.css";

// ตั้งค่าฟอนต์ IBM Plex Sans Thai
const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm",
  display: "swap",
});

// ตั้งค่าฟอนต์ Mali
const mali = Mali({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-mali",
  display: "swap",
});

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
      {/* แทรกตัวแปรฟอนต์เข้าไปใน body */}
      <body className={`antialiased bg-grid ${ibmPlexSansThai.variable} ${mali.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}