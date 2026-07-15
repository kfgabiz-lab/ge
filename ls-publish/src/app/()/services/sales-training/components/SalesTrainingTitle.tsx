import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { salesTrainingPage } from "@/data/services/salesTrainingContent";

export default function SalesTrainingTitle() {
  const { title, description } = salesTrainingPage;

  return <CompanyAboutTitleSection title={title} description={description} />;
}
