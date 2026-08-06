"use client";

import { useRouter } from "next/navigation";
import ContactUsTermsModal from "../components/ContactUsTermsModal";
import "@/assets/css/support.css";

export default function ContactUsTermsModalPage() {
  const router = useRouter();

  return (
    <main
      className="support-page support-page--contact-us-terms-modal"
      id="Page_support_contact_terms_modal"
    >
      <ContactUsTermsModal open onClose={() => router.back()} />
    </main>
  );
}
