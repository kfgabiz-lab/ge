import { notFound } from "next/navigation";
import EngineeringTrainingDetailHero from "../components/EngineeringTrainingDetailHero";
import EngineeringTrainingDetailSchedule from "../components/EngineeringTrainingDetailSchedule";
import {
  engineeringTrainingDetailIds,
  getEngineeringTrainingDetail,
} from "@/data/services/engineeringTrainingDetailContent";
import "@/assets/css/training.css";

type EngineeringTrainingDetailPageProps = {
  params: Promise<{ courseId: string }>;
};

export function generateStaticParams() {
  return engineeringTrainingDetailIds.map((courseId) => ({ courseId }));
}

export default async function EngineeringTrainingDetailPage({
  params,
}: EngineeringTrainingDetailPageProps) {
  const { courseId } = await params;
  const detail = getEngineeringTrainingDetail(courseId);

  if (!detail) {
    notFound();
  }

  return (
    <main
      className="support-page support-page--engineering-training-detail"
      id="P-FO-SERV-030100P"
    >
      <EngineeringTrainingDetailHero detail={detail} />
      <EngineeringTrainingDetailSchedule detail={detail} />
    </main>
  );
}
