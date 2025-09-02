import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MediTrack - Medication Inventory Management",
  description: "Professional medication inventory management system",
  icons: {
    icon: "https://static.wixstatic.com/media/c49a9b_6c24f096e7994c1183c486f4853839b8~mv2.png",
    shortcut: "https://static.wixstatic.com/media/c49a9b_6c24f096e7994c1183c486f4853839b8~mv2.png",
    apple: "https://static.wixstatic.com/media/c49a9b_6c24f096e7994c1183c486f4853839b8~mv2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}