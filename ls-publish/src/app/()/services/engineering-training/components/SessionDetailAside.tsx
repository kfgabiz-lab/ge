"use client";

import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import { engineeringTrainingSessionAssets } from "@/data/services/engineeringTrainingSessionDetailContent";
import EngineeringTrainingSessionCountdown from "./EngineeringTrainingSessionCountdown";

function SessionMetaLabel({
  icon,
  children,
}: {
  icon: string;
  children: string;
}) {
  return (
    <p className="support_service_training_session_detail__meta-label">
      <span className="support_service_training_session_detail__meta-icon" aria-hidden>
        <img src={icon} alt="" width={20} height={20} loading="lazy" decoding="async" />
      </span>
      {children}
    </p>
  );
}

export default function SessionDetailAside({
  session,
  variant,
  onRegister,
}: {
  session: EngineeringTrainingSessionDetail;
  variant: "pc" | "mo";
  onRegister: () => void;
}) {
  const { sidebar } = session;
  const { metaIcons } = engineeringTrainingSessionAssets;

  return (
    <aside
      className={`support_service_training_session_detail__aside support_service_training_session_detail__aside--${variant}`}
    >
      <EngineeringTrainingSessionCountdown />

      <div className="support_service_training_session_detail__meta">
        <div className="support_service_training_session_detail__meta-grid">
          <div className="support_service_training_session_detail__meta-row">
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.date}>DATE</SessionMetaLabel>
              <p className="support_service_training_session_detail__meta-value">
                {sidebar.date}
              </p>
            </div>
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.duration}>DURATION</SessionMetaLabel>
              <p className="support_service_training_session_detail__meta-value">
                {sidebar.duration}
              </p>
            </div>
          </div>

          <div className="support_service_training_session_detail__meta-row">
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.trainingType}>
                Training Type
              </SessionMetaLabel>
              <p className="support_service_training_session_detail__meta-value">
                {sidebar.trainingType}
              </p>
            </div>
            <div className="support_service_training_session_detail__meta-item">
              <SessionMetaLabel icon={metaIcons.classSize}>CLASS SIZE</SessionMetaLabel>
              <p className="support_service_training_session_detail__meta-value">
                {sidebar.classSize}
              </p>
            </div>
          </div>
        </div>

        <div className="support_service_training_session_detail__meta-item support_service_training_session_detail__meta-item--location">
          <div className="support_service_training_session_detail__meta-head">
            <SessionMetaLabel icon={metaIcons.location}>
              LOCATION INFORMATION
            </SessionMetaLabel>
            <p className="support_service_training_session_detail__meta-value">
              {sidebar.location.name}
            </p>
          </div>
          <ul className="support_service_training_session_detail__meta-bullets">
            <li>{sidebar.location.address}</li>
            <li>{sidebar.location.phone}</li>
            <li>{sidebar.location.email}</li>
          </ul>
        </div>

        <div className="support_service_training_session_detail__meta-item support_service_training_session_detail__meta-item--products">
          <SessionMetaLabel icon={metaIcons.products}>
            PRODUCTS COVERED
          </SessionMetaLabel>
          <p className="support_service_training_session_detail__meta-text">
            {sidebar.productsCovered}
          </p>
        </div>

        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--line support_service_training_session_detail__register"
          onClick={onRegister}
        >
          <span>{sidebar.registerLabel}</span>
          <img
            src={engineeringTrainingSessionAssets.registerScrollIcon}
            alt=""
            width={16}
            height={16}
            loading="lazy"
            decoding="async"
            aria-hidden
          />
        </button>
      </div>
    </aside>
  );
}
