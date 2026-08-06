import ContactUsBanner from "./components/ContactUsBanner";
import ContactUsForm from "./components/ContactUsForm";
import ContactUsTitle from "./components/ContactUsTitle";
import "@/assets/css/support.css";

export default function ContactUsPage() {
  return (
    <main
      className="support-page support-page--contact-us"
      id="Page_support_contact_us"
    >
      <ContactUsTitle />
      <ContactUsBanner />
      <ContactUsForm />
    </main>
  );
}
