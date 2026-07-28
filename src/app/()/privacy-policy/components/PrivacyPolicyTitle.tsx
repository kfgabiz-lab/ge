import { privacyPolicyPage } from "@/data/privacyPolicyPageContent";

export default function PrivacyPolicyTitle() {
  return (
    <section className="common_privacy_policy_title" id="privacy-policy-title">
      <div className="inner">
        <h1 className="common_privacy_policy_title__heading">
          {privacyPolicyPage.title}
        </h1>
      </div>
    </section>
  );
}
