"use client";

import Image from "next/image";
import {
  Anchor,
  ArrowDown,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Container,
  Gauge,
  Mail,
  MapPin,
  Network,
  PackageSearch,
  PanelsTopLeft,
  Phone,
  ReceiptText,
  Ship,
  Warehouse,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";
import { TrackingHub } from "@/components/TrackingHub";
import { content as siteContent } from "@/data/content";
import type { Language } from "@/data/types";

const serviceIcons = [Ship, Anchor, Warehouse, Network];
const smartIcons = [PanelsTopLeft, CalendarDays, PackageSearch, ReceiptText];

export function HomePage() {
  const [language, setLanguage] = useState<Language>("vi");
  const [smartFeedback, setSmartFeedback] = useState("");
  const content = siteContent[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setSmartFeedback("");
  };

  const handleSmartTool = (title: string) => {
    setSmartFeedback(`${title} ${content.common.demoConnecting}.`);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        {content.common.skipToContent}
      </a>
      <div id="top" />
      <Header
        content={content}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <Image
            className="hero-image"
            src="/images/hero-port.webp"
            alt={content.hero.imageAlt}
            fill
            sizes="100vw"
            priority
          />
          <div className="hero-overlay" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="page-shell hero-content">
            <p className="hero-kicker">{content.hero.eyebrow}</p>
            <h1 id="hero-title">{content.hero.headline}</h1>
            <p className="hero-copy">{content.hero.body}</p>
            <a className="button button-cyan" href="#contact">
              {content.hero.cta}
              <ArrowDown aria-hidden="true" />
            </a>

            <div className="hero-facts" aria-label="VTA Global Port highlights">
              <div>
                <span>{content.hero.routeLabel}</span>
                <strong>{content.hero.routeValue}</strong>
              </div>
              <div>
                <span>{content.hero.operatingLabel}</span>
                <strong>{content.hero.operatingValue}</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="page-shell tracking-wrap">
          <TrackingHub content={content.tracking} />
        </div>

        <section id="company" className="company-section section-anchor">
          <div className="page-shell company-grid">
            <div className="company-copy reveal-item">
              <p className="section-kicker">{content.company.eyebrow}</p>
              <h2>{content.company.title}</h2>
              <p>{content.company.body}</p>
              <ul className="value-list">
                {content.company.values.map((value) => (
                  <li key={value}>
                    <CheckCircle2 aria-hidden="true" />
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            <div className="company-visual reveal-item">
              <Image
                src="/images/warehouse.webp"
                alt={content.company.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <div className="company-visual-label">
                <Container aria-hidden="true" />
                <span>{content.company.visualLabel}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services-section section-anchor">
          <div className="page-shell">
            <div className="section-heading services-heading">
              <div>
                <p className="section-kicker">{content.services.eyebrow}</p>
                <h2>{content.services.title}</h2>
              </div>
              <p>{content.services.description}</p>
            </div>

            <div className="services-layout">
              <div className="services-visual">
                <Image
                  src="/images/logistics-yard.webp"
                  alt={content.services.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                />
                <div className="image-index" aria-hidden="true">
                  <span>VTA</span>
                  <strong>01—04</strong>
                </div>
              </div>
              <ol className="service-list">
                {content.services.items.map((service, index) => {
                  const ServiceIcon = serviceIcons[index];
                  return (
                    <li key={service.title}>
                      <span className="service-number">0{index + 1}</span>
                      <span className="service-icon">
                        <ServiceIcon aria-hidden="true" />
                      </span>
                      <span className="service-text">
                        <strong>{service.title}</strong>
                        <small>{service.description}</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        <section id="fleet" className="fleet-section section-anchor">
          <div className="page-shell">
            <div className="fleet-intro">
              <div>
                <p className="section-kicker section-kicker-light">{content.fleet.eyebrow}</p>
                <h2>{content.fleet.title}</h2>
              </div>
              <div className="fleet-description">
                <p>{content.fleet.description}</p>
                <a className="text-link-light" href="#contact">
                  {content.fleet.cta}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="fleet-stage">
              <Image
                src="/images/fleet-ship.webp"
                alt={content.fleet.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 72vw"
              />
              <div className="fleet-count">
                <strong>{content.fleet.vesselCount}</strong>
                <span>{content.fleet.vesselCountLabel}</span>
              </div>
              <div className="fleet-watermark" aria-hidden="true">
                <Waves />
                <span>{content.fleet.watermark}</span>
              </div>
            </div>

            <div className="fleet-groups">
              {content.fleet.groups.map((group, index) => (
                <article key={group.title}>
                  <span>0{index + 1}</span>
                  {index === 0 ? <Ship aria-hidden="true" /> : <Waves aria-hidden="true" />}
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="news" className="news-section section-anchor">
          <div className="page-shell">
            <div className="section-heading news-heading">
              <div>
                <p className="section-kicker">{content.news.eyebrow}</p>
                <h2>{content.news.title}</h2>
              </div>
              <p>{content.news.description}</p>
            </div>

            <div className="news-list">
              {content.news.items.map((item, index) => (
                <article className="news-item" key={item.category}>
                  <div className={`news-art news-art-${index + 1}`} aria-hidden="true">
                    {index === 0 && <Gauge />}
                    {index === 1 && <CalendarDays />}
                    {index === 2 && <Waves />}
                    <span>0{index + 1}</span>
                  </div>
                  <div className="news-copy">
                    <p>{item.category}</p>
                    <h3>{item.title}</h3>
                    <span>{item.description}</span>
                    <small>{item.status}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="smart" className="smart-section section-anchor">
          <div className="page-shell smart-grid">
            <div className="smart-copy">
              <p className="section-kicker">{content.smart.eyebrow}</p>
              <h2>{content.smart.title}</h2>
              <p>{content.smart.description}</p>
              <div className="smart-tool-list">
                {content.smart.tools.map((tool, index) => {
                  const SmartIcon = smartIcons[index];
                  return (
                    <button type="button" key={tool.title} onClick={() => handleSmartTool(tool.title)}>
                      <span>
                        <SmartIcon aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{tool.title}</strong>
                        <small>{tool.description}</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <p className="smart-feedback" role="status" aria-live="polite">
                {smartFeedback}
              </p>
            </div>

            <div className="smart-console" aria-label={content.smart.interfaceLabel}>
              <div className="console-header">
                <span>{content.smart.interfaceLabel}</span>
                <span>
                  <i aria-hidden="true" /> {content.smart.systemOnline}
                </span>
              </div>
              <div className="console-map" aria-hidden="true">
                <span className="route route-one" />
                <span className="route route-two" />
                <span className="route route-three" />
                <i className="node node-one" />
                <i className="node node-two" />
                <i className="node node-three" />
                <i className="node node-four" />
                <div className="console-vessel">
                  <Ship />
                </div>
                <div className="console-cargo">
                  <Boxes />
                </div>
              </div>
              <div className="console-metrics" aria-hidden="true">
                <span><i className="metric-one" /></span>
                <span><i className="metric-two" /></span>
                <span><i className="metric-three" /></span>
                <span><i className="metric-four" /></span>
                <span><i className="metric-five" /></span>
                <span><i className="metric-six" /></span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-anchor">
          <div className="page-shell contact-grid">
            <div className="contact-intro">
              <p className="section-kicker section-kicker-light">{content.contact.eyebrow}</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.description}</p>

              <div className="contact-details">
                <h3>{content.contact.detailsTitle}</h3>
                <div>
                  <MapPin aria-hidden="true" />
                  <span>
                    <small>{content.contact.addressLabel}</small>
                    <strong>{content.contact.address}</strong>
                  </span>
                </div>
                <div>
                  <Phone aria-hidden="true" />
                  <span>
                    <small>{content.contact.phoneLabel}</small>
                    <strong>{content.contact.phone}</strong>
                    <small>{content.contact.faxLabel}: {content.contact.fax}</small>
                  </span>
                </div>
                <div>
                  <Mail aria-hidden="true" />
                  <span>
                    <small>{content.contact.emailLabel}</small>
                    <strong>{content.contact.email}</strong>
                  </span>
                </div>
                <p className="confirmation-note">{content.contact.confirmationNote}</p>
              </div>
            </div>

            <ContactForm content={content.contact} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-main">
          <div className="footer-brand">
            <Image
              src="/images/vta-logo-light.png"
              alt="VTA Global Port"
              width={1097}
              height={1196}
              sizes="110px"
            />
            <p>{content.footer.tagline}</p>
          </div>
          <nav aria-label={content.footer.navigationLabel}>
            {content.nav.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="back-to-top" href="#top">
            {content.footer.top}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="page-shell footer-bottom">
          <span>{content.footer.copyright}</span>
          <span>{content.contact.address}</span>
        </div>
      </footer>
    </>
  );
}
