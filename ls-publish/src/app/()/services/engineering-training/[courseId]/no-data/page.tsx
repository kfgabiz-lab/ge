import { notFound } from "next/navigation";
import EngineeringTrainingDetailHero from "../../components/EngineeringTrainingDetailHero";
import EngineeringTrainingDetailSchedule from "../../components/EngineeringTrainingDetailSchedule";
import { getEngineeringTrainingDetail } from "@/data/services/engineeringTrainingDetailContent";
import "@/assets/css/training.css";

type EngineeringTrainingDetailNoDataPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EngineeringTrainingDetailNoDataPage({
  params,
}: EngineeringTrainingDetailNoDataPageProps) {
  const { courseId } = await params;
  const detail = getEngineeringTrainingDetail(courseId);

  if (!detail) {
    notFound();
  }

  return (
    <main
      className="support-page support-page--engineering-training-detail"
      id="P-FO-SERV-030100P_no_data"
    >
      <EngineeringTrainingDetailHero detail={detail} />
      <EngineeringTrainingDetailSchedule detail={detail} empty />
    </main>
  );
}
