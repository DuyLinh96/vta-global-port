"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { content as siteContent } from "@/data/content";
import type { Language } from "@/data/types";

interface ContentSection {
  id: string;
  title: string;
  body: string;
}

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  sections?: ContentSection[];
  children?: ReactNode;
}

export function ContentPage({ eyebrow, title, description, image, sections = [], children }: ContentPageProps) {
  const [language, setLanguage] = useState<Language>("vi");
  const content = siteContent[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {content.common.skipToContent}
      </a>
      <div id="top" />
      <Header content={content} language={language} onLanguageChange={setLanguage} />
      <main id="main-content" className="content-page">
        <section className="content-hero">
          <div className="page-shell content-hero-grid">
            <div className="content-hero-copy">
              <p className="section-kicker section-kicker-light">{eyebrow}</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <div className="content-hero-media">
              <Image
                className="content-hero-image"
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 940px) 100vw, 46vw"
                priority
              />
            </div>
          </div>
        </section>
        {children}
        {sections.length > 0 && (
          <section className="content-section-list">
            <div className="page-shell content-card-grid">
              {sections.map((section, index) => (
                <article id={section.id} className="content-card section-anchor" key={section.id}>
                  <span>0{index + 1}</span>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  <ArrowUpRight aria-hidden="true" />
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
