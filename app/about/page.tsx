import { ContentPage } from "@/components/ContentPage";
import { content } from "@/data/content";

const company = content.vi.company;

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="VTA Global Port"
      title="Về chúng tôi"
      description={company.body}
      image={{ src: "/images/container-port-ship.jpg", alt: company.imageAlt }}
      sections={[
        {
          id: "mission-vision",
          title: "Sứ mệnh và tầm nhìn",
          body: company.subtitle,
        },
        {
          id: "core-values",
          title: "Giá trị cốt lõi",
          body: company.values.join(" · "),
        },
        {
          id: "leadership",
          title: "Lãnh đạo",
          body: "Đội ngũ điều hành định hướng VTA Global Port phát triển bền vững, an toàn và hiệu quả trong chuỗi cung ứng hiện đại.",
        },
      ]}
    />
  );
}
