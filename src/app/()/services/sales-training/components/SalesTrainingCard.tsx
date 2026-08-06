import Link from "next/link";
import type { SalesTrainingCourse } from "@/data/services/salesTrainingContent";

export default function SalesTrainingCard({
  course,
}: {
  course: SalesTrainingCourse;
}) {
  const detailHref = `/services/sales-training/${course.id}`;

  return (
    <Link href={detailHref} className="support_service_training_card">
      <div className="support_service_training_card__media">
        <img loading="lazy" decoding="async" src={course.image} alt="" />
      </div>
      <div className="support_service_training_card__body">
        <p className="support_service_training_card__category">{course.category}</p>
        <div className="support_service_training_card__text">
          <h3 className="support_service_training_card__tit">{course.title}</h3>
          {course.descriptionLines ? (
            <p className="support_service_training_card__desc">
              {course.descriptionLines.map((line, index) => (
                <span key={`${course.id}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
          ) : (
            <p className="support_service_training_card__desc">{course.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
