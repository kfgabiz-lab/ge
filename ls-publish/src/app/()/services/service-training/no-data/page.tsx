import ServiceTrainingCurriculum from "../components/ServiceTrainingCurriculum";
import ServiceTrainingTitle from "../components/ServiceTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function ServiceTrainingNoDataPage() {
  return (
    <main
      className="support-page support-page--service-training"
      id="P-FO-SERV-030000P_1_no_data"
    >
      <ServiceTrainingTitle />
      <ServiceTrainingCurriculum empty />
    </main>
  );
}
