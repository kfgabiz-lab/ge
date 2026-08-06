import { contactUsPage } from "@/data/support/contactUsContent";

export default function ContactUsTitle() {
  return (
    <section className="support_contact_title" id="support-contact-title">
      <div className="inner">
        <h1 className="support_contact_title__heading">{contactUsPage.title}</h1>
        <p className="support_contact_title__desc">{contactUsPage.description}</p>
      </div>
    </section>
  );
}
