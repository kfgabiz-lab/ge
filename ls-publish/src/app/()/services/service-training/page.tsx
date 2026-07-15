import ServiceTrainingCurriculum from "./components/ServiceTrainingCurriculum";
import ServiceTrainingTitle from "./components/ServiceTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

/** P-FO-SERV-030000P_1 — Service Training curriculum list (clone of Engineering Training) */
export default function ServiceTrainingPage() {
  return (
    <main
      className="support-page support-page--service-training"
      id="P-FO-SERV-030000P_1"
    >
      <ServiceTrainingTitle />
      <ServiceTrainingCurriculum />
    </main>
  );
}
