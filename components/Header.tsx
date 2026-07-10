"use client";

import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Language, SiteContent } from "@/data/types";

interface HeaderProps {
  content: SiteContent;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Header({ content, language, onLanguageChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand-link"
          href="#top"
          aria-label={content.common.brandHome}
          onClick={closeMenu}
        >
          <span className="brand-mark">
            <Image
              src="/images/vta-mark-light.png"
              alt=""
              width={980}
              height={980}
              sizes="56px"
              priority
            />
          </span>
          <span className="brand-name">
            <strong>VTA</strong>
            <span>Global Port</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label={content.common.primaryNavigation}>
          <ul>
            {content.nav.map((item) => (
              <li className="nav-group" key={item.label}>
                <a href={item.href}>
                  {item.label}
                  {item.children.length > 0 && <ChevronDown aria-hidden="true" size={14} />}
                </a>
                {item.children.length > 0 && (
                  <ul className="nav-submenu">
                    {item.children.map((child) => (
                      <li key={child}>
                        <a href={item.href}>{child}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="language-switch" aria-label={content.common.language} role="group">
            <button
              type="button"
              aria-pressed={language === "vi"}
              aria-label={content.common.vietnamese}
              onClick={() => onLanguageChange("vi")}
            >
              VI
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              aria-pressed={language === "en"}
              aria-label={content.common.english}
              onClick={() => onLanguageChange("en")}
            >
              EN
            </button>
          </div>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? content.common.closeMenu : content.common.menu}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label={content.common.mobileNavigation}
      >
        <ul>
          {content.nav.map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={closeMenu}>
                <strong>{item.label}</strong>
                <span>{item.children.join(" · ")}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
