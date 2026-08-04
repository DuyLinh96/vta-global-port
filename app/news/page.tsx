import { ContentPage } from "@/components/ContentPage";
import { content } from "@/data/content";

const news = content.vi.news;

export default function NewsPage() {
  return (
    <ContentPage
      eyebrow={news.eyebrow}
      title={news.title}
      description={news.description}
      image={{ src: "/images/cai-mep-ship-cranes.jpg", alt: "Toàn cảnh cảng biển Cái Mép với tàu container và cần cẩu" }}
      sections={[
        { id: "operations", title: news.items[0].title, body: news.items[0].status },
        { id: "events", title: news.items[1].title, body: news.items[1].status },
        { id: "media", title: news.items[2].title, body: news.items[2].status },
        { id: "careers", title: news.items[3].title, body: news.items[3].status },
      ]}
    />
  );
}
