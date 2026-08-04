import { ContentPage } from "@/components/ContentPage";
import { FleetCards } from "@/components/FleetCards";
import { content } from "@/data/content";

const fleet = content.vi.fleet;

export default function FleetPage() {
  return (
    <ContentPage
      eyebrow={fleet.eyebrow}
      title={fleet.title}
      description={fleet.description}
      image={{ src: "/images/cai-mep-port-panorama.jpg", alt: fleet.imageAlt }}
    >
      <section className="fleet-detail-section">
        <div className="page-shell">
          <FleetCards />
        </div>
      </section>
    </ContentPage>
  );
}
