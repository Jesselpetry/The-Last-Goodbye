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
  // Base URL: สำคัญมากเพื่อให้รูปภาพทำงานได้ถูกต้อง (เปลี่ยนเป็นโดเมนจริงของคุณเมื่อ Deploy)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  
  title: "The Last Goodbye",
  description: "จดหมายอำลาก่อนแยกย้ายไปเติบโต",
  
  // การตั้งค่า Open Graph (Facebook, LINE, Discord ฯลฯ)
  openGraph: {
    title: "The Last Goodbye",
    description: "จดหมายอำลาก่อนแยกย้ายไปเติบโต",
    url: "/",
    siteName: "The Last Goodbye",
    images: [
      {
        url: "/opengraph-image.png", // ตรวจสอบว่ามีไฟล์นี้ในโฟลเดอร์ public หรือ app
        width: 1200,
        height: 630,
        alt: "The Last Goodbye Preview",
      },
    ],
    locale: "th_TH",
    type: "website",
  },

  // การตั้งค่า Twitter Card (X)
  twitter: {
    card: "summary_large_image",
    title: "The Last Goodbye",
    description: "จดหมายอำลาก่อนแยกย้ายไปเติบโต",
    images: ["/opengraph-image.png"], // ใช้รูปเดียวกัน
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`antialiased bg-grid ${ibmPlexSansThai.variable} ${mali.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
