import SalesTrainingCurriculum from "../components/SalesTrainingCurriculum";
import SalesTrainingTitle from "../components/SalesTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function SalesTrainingNoDataPage() {
  return (
    <main
      className="support-page support-page--sales-training"
      id="P-FO-SERV-030000P_2_no_data"
    >
      <SalesTrainingTitle />
      <SalesTrainingCurriculum empty />
    </main>
  );
}
