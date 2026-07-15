import SalesTrainingCurriculum from "./components/SalesTrainingCurriculum";
import SalesTrainingTitle from "./components/SalesTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

/** P-FO-SERV-030000P_2 — Sales Training curriculum list (clone of Engineering Training) */
export default function SalesTrainingPage() {
  return (
    <main
      className="support-page support-page--sales-training"
      id="P-FO-SERV-030000P_2"
    >
      <SalesTrainingTitle />
      <SalesTrainingCurriculum />
    </main>
  );
}
