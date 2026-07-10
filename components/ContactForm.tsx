"use client";

import { ArrowUpRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { SiteContent } from "@/data/types";

interface ContactFormProps {
  content: SiteContent["contact"];
}

export function ContactForm({ content }: ContactFormProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setFeedback(content.success);
    form.reset();
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h3>{content.formTitle}</h3>
        <p>{content.requiredNote}</p>
      </div>

      <div className="form-grid">
        <div className="field-group">
          <label htmlFor="full-name">
            {content.fullName} <span aria-hidden="true">*</span>
          </label>
          <input id="full-name" name="fullName" autoComplete="name" required />
        </div>
        <div className="field-group">
          <label htmlFor="company-name">{content.companyName}</label>
          <input id="company-name" name="companyName" autoComplete="organization" />
        </div>
        <div className="field-group">
          <label htmlFor="position">{content.position}</label>
          <input id="position" name="position" autoComplete="organization-title" />
        </div>
        <div className="field-group">
          <label htmlFor="business-email">
            {content.emailField} <span aria-hidden="true">*</span>
          </label>
          <input id="business-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field-group">
          <label htmlFor="phone-number">
            {content.phoneField} <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone-number"
            name="phone"
            type="tel"
            autoComplete="tel"
            minLength={8}
            required
          />
        </div>
        <div className="field-group">
          <label htmlFor="interest">{content.interest}</label>
          <select id="interest" name="interest" defaultValue="">
            <option value="" disabled>
              {content.selectPlaceholder}
            </option>
            {content.options.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group field-group-wide">
          <label htmlFor="request-message">{content.message}</label>
          <textarea id="request-message" name="message" rows={5} />
        </div>
      </div>

      <div className="form-footer">
        <button className="button button-dark" type="submit">
          {content.submit}
          <ArrowUpRight aria-hidden="true" />
        </button>
        <p role="status" aria-live="polite">
          {feedback}
        </p>
      </div>
    </form>
  );
}
