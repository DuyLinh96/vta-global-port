import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "VTA Global Port | Vững bước thành công",
  description:
    "VTA Global Port cung cấp giải pháp khai thác cảng, vận tải đường thủy, kho bãi và logistics đồng bộ, an toàn và hiệu quả.",
  keywords: [
    "VTA Global Port",
    "khai thác cảng",
    "vận tải đường biển",
    "logistics",
    "kho bãi",
  ],
  openGraph: {
    title: "VTA Global Port | Vững bước thành công",
    description:
      "Giải pháp vận chuyển và khai thác hiệu quả, tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận.",
    type: "website",
    locale: "vi_VN",
    siteName: "VTA Global Port",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0146",
  colorScheme: "light",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
