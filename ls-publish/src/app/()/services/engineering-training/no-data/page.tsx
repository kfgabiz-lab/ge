import EngineeringTrainingCurriculum from "../components/EngineeringTrainingCurriculum";
import EngineeringTrainingTitle from "../components/EngineeringTrainingTitle";
import "@/assets/css/company.css";
import "@/assets/css/training.css";

export default function EngineeringTrainingNoDataPage() {
  return (
    <main
      className="support-page support-page--engineering-training"
      id="P-FO-SERV-030000P_no_data"
    >
      <EngineeringTrainingTitle />
      <EngineeringTrainingCurriculum empty />
    </main>
  );
}
