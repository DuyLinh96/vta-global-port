import { ContentPage } from "@/components/ContentPage";
import { content } from "@/data/content";

const smart = content.vi.smart;

export default function SmartManagementPage() {
  return (
    <ContentPage
      eyebrow={smart.eyebrow}
      title={smart.title}
      description={smart.description}
      image={{ src: "/images/cai-mep-terminal-aerial.jpg", alt: "Toàn cảnh khu cảng container phục vụ quản lý vận hành thông minh" }}
      sections={[
        { id: "my-vta-port", title: smart.tools[0].title, body: "Cổng quản lý tập trung hỗ trợ khách hàng theo dõi và làm việc với hệ sinh thái dịch vụ VTA Global Port." },
        { id: "schedule", title: smart.tools[1].title, body: "Tra cứu lịch tàu và hành trình dự kiến để chủ động kế hoạch vận chuyển." },
        { id: "tracking", title: smart.tools[2].title, body: "Theo dõi trạng thái hàng hóa và mã tham chiếu trong quá trình vận hành logistics." },
        { id: "tariffs", title: smart.tools[3].title, body: "Khu vực biểu cước hỗ trợ khách hàng tham khảo chi phí và gửi yêu cầu tư vấn phù hợp." },
      ]}
    />
  );
}
