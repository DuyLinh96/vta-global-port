import { ContentPage } from "@/components/ContentPage";
import { content } from "@/data/content";

const contact = content.vi.contact;

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow={contact.eyebrow}
      title={contact.title}
      description={contact.description}
      image={{ src: "/images/container-port-ship.jpg", alt: "Tàu container cập cảng trong khu vực logistics" }}
      sections={[
        { id: "address", title: contact.addressLabel, body: contact.address },
        { id: "phone", title: contact.phoneLabel, body: `${contact.phone} · ${contact.faxLabel}: ${contact.fax}` },
        { id: "email", title: contact.emailLabel, body: contact.email },
      ]}
    />
  );
}
