import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";

const pdfHref = "/doc/DOC-20260909-WA0001_260917_090753_1.pdf";

export const metadata: Metadata = {
  title: "Kê khai giá dịch vụ | VTA Global Port",
  description: "Tài liệu kê khai giá dịch vụ của VTA Global Port.",
};

export default function ServicePricesPage() {
  return (
    <ContentPage
      eyebrow="Dịch vụ"
      title="Kê khai giá dịch vụ"
      description="Tài liệu kê khai giá dịch vụ của VTA Global Port. Quý khách có thể xem trực tiếp hoặc tải file PDF để lưu trữ."
      image={{ src: "/images/cai-mep-ship-cranes.jpg", alt: "Cảng container và cần cẩu khai thác hàng hóa" }}
    >
      <section className="service-prices-section">
        <object
          className="pdf-document-viewer"
          data={pdfHref}
          type="application/pdf"
          aria-label="PDF Kê khai giá dịch vụ"
        >
          <p>
            Trình duyệt không hỗ trợ xem PDF trực tiếp. <a href={pdfHref}>Mở file PDF</a>.
          </p>
        </object>
      </section>
    </ContentPage>
  );
}
