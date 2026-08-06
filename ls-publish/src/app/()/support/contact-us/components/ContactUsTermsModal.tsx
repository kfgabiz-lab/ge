"use client";

import { useEffect, useId } from "react";
import { contactUsPrivacyPolicyModal } from "@/data/support/contactUsContent";

type ContactUsTermsModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
};

export default function ContactUsTermsModal({
  open,
  onClose,
  embedded = false,
}: ContactUsTermsModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open || embedded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedded, open, onClose]);

  if (!open) return null;

  return (
    <div
      className={
        embedded
          ? "support_contact_terms_modal support_contact_terms_modal--embedded"
          : "support_contact_terms_modal"
      }
    >
      {!embedded ? (
        <button
          type="button"
          className="support_contact_terms_modal__dim"
          aria-label="Close dialog"
          onClick={onClose}
        />
      ) : null}
      <div
        className="support_contact_terms_modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="support_contact_terms_modal__head">
          <div className="support_contact_terms_modal__head-row">
            <h2 id={titleId} className="support_contact_terms_modal__tit">
              {contactUsPrivacyPolicyModal.title}
            </h2>
            <button
              type="button"
              className="support_contact_terms_modal__close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <hr className="support_contact_terms_modal__line" />
        </header>
        <div className="support_contact_terms_modal__body">
          {contactUsPrivacyPolicyModal.sections.map((section) => (
            <article
              key={section.heading}
              className="support_contact_terms_modal__section"
            >
              <h3 className="support_contact_terms_modal__section-tit">
                {section.heading}
              </h3>
              <div className="support_contact_terms_modal__text">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
                <ol className="support_contact_terms_modal__list">
                  {section.listItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <p>{section.outro}</p>
              </div>
            </article>
          ))}
        </div>
        <footer className="support_contact_terms_modal__foot">
          <button
            type="button"
            className="btn-base btn-lv01 btn-lv01--solid support_contact_terms_modal__confirm"
            onClick={onClose}
          >
            {contactUsPrivacyPolicyModal.confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
