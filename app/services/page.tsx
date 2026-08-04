import { ContentPage } from "@/components/ContentPage";
import { content } from "@/data/content";

const services = content.vi.services;

export default function ServicesPage() {
  return (
    <ContentPage
      eyebrow={services.eyebrow}
      title={services.title}
      description={services.description}
      image={{ src: "/images/cai-mep-terminal-aerial.jpg", alt: services.imageAlt }}
      sections={[
        { id: "sea-freight", title: services.items[0].title, body: services.items[0].description },
        { id: "port-operations", title: services.items[1].title, body: services.items[1].description },
        { id: "warehousing", title: services.items[2].title, body: services.items[2].description },
        {
          id: "logistics",
          title: "Dịch vụ logistics",
          body: "Giải pháp logistics đồng bộ giúp tối ưu luồng hàng, kết nối cảng, kho bãi và điểm giao nhận theo nhu cầu vận hành của khách hàng.",
        },
      ]}
    />
  );
}
