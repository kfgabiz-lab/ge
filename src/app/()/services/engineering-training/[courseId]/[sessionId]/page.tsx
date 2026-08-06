import { notFound } from "next/navigation";
import EngineeringTrainingSessionDetail from "../../components/EngineeringTrainingSessionDetail";
import {
  engineeringTrainingSessionParams,
  getEngineeringTrainingSessionDetail,
} from "@/data/services/engineeringTrainingSessionDetailContent";
import "@/assets/css/training.css";

type EngineeringTrainingSessionPageProps = {
  params: Promise<{ courseId: string; sessionId: string }>;
};

export function generateStaticParams() {
  return engineeringTrainingSessionParams;
}

export default async function EngineeringTrainingSessionPage({
  params,
}: EngineeringTrainingSessionPageProps) {
  const { courseId, sessionId } = await params;
  const session = getEngineeringTrainingSessionDetail(courseId, sessionId);

  if (!session) {
    notFound();
  }

  return (
    <main
      className="support-page support-page--engineering-training-session"
      id="P-FO-SERV-030101P"
    >
      <EngineeringTrainingSessionDetail session={session} />
    </main>
  );
}
