"use client";

import { ArrowUpRight, CalendarDays, MapPinned, Search, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ShortcutId, SiteContent } from "@/data/types";

interface TrackingHubProps {
  content: SiteContent["tracking"];
}

function ShortcutIcon({ id }: { id: ShortcutId }) {
  if (id === "quote") {
    return <Send aria-hidden="true" />;
  }

  if (id === "schedule") {
    return <CalendarDays aria-hidden="true" />;
  }

  return <MapPinned aria-hidden="true" />;
}

export function TrackingHub({ content }: TrackingHubProps) {
  const [trackingCode, setTrackingCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(trackingCode.trim() ? content.demoFeedback : content.emptyFeedback);
  };

  const handleShortcut = (id: ShortcutId, title: string) => {
    if (id === "quote") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      setFeedback(content.quoteFeedback);
      return;
    }

    setFeedback(`${title}: ${content.demoFeedback}`);
  };

  return (
    <section className="tracking-hub" aria-labelledby="tracking-title">
      <div className="tracking-main">
        <p className="section-kicker">{content.eyebrow}</p>
        <h2 id="tracking-title">{content.title}</h2>
        <form className="tracking-form" onSubmit={handleTrack} noValidate>
          <label htmlFor="tracking-code">{content.label}</label>
          <div className="tracking-input-row">
            <span className="tracking-search-icon" aria-hidden="true">
              <Search />
            </span>
            <input
              id="tracking-code"
              name="trackingCode"
              value={trackingCode}
              placeholder={content.placeholder}
              autoComplete="off"
              onChange={(event) => setTrackingCode(event.target.value)}
            />
            <button type="submit">
              {content.button}
              <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </form>
        <p className="tracking-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      </div>

      <div className="shortcut-panel">
        <p>{content.shortcutsLabel}</p>
        <div className="shortcut-list">
          {content.shortcuts.map((shortcut) => (
            <button
              type="button"
              key={shortcut.id}
              onClick={() => handleShortcut(shortcut.id, shortcut.title)}
            >
              <span className="shortcut-icon">
                <ShortcutIcon id={shortcut.id} />
              </span>
              <span>
                <strong>{shortcut.title}</strong>
                <small>{shortcut.description}</small>
              </span>
              <ArrowUpRight className="shortcut-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
