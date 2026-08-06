import CompanyAboutTitleSection from "@/app/()/company/components/CompanyAboutTitleSection";
import { serviceTrainingPage } from "@/data/services/serviceTrainingContent";

export default function ServiceTrainingTitle() {
  const { title, description } = serviceTrainingPage;

  return <CompanyAboutTitleSection title={title} description={description} />;
}
