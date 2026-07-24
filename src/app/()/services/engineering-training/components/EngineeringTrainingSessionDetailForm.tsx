"use client";

import {
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import {
  GuideCheckboxIcon,
  GuideSelectIcon,
  guideCheckboxIconsContactConsent,
} from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import type { EngineeringTrainingSessionDetail } from "@/data/services/engineeringTrainingSessionDetailContent";
import {
  engineeringTrainingSessionAssets,
  engineeringTrainingSessionFormCopy,
} from "@/data/services/engineeringTrainingSessionDetailContent";

const FIELD_ERROR = engineeringTrainingSessionFormCopy.fieldError;

/**
 * 에러 / 정상 구분 (값 내용이 아니라 props로 판단)
 * - 에러: FieldShell `error="메시지"` + TextField/Select `error`
 *   → `--field--error` 클래스, helper 문구, 빨간 보더
 * - Checkbox: `guide_checkbox--error` + `guide_checkbox__error` helper
 * - 정상: `error` / `--error` 생략
 *   → 기본 보더, helper 없음
 * 가이드: `/guide/components` · docs/COMPONENT_GUIDE.md
 */
function FieldError({ message }: { message: string }) {
  return (
    <p className="support_service_training_session_detail__error" role="alert">
      {message}
    </p>
  );
}

function FieldShell({
  className = "",
  error, // string이면 에러 UI, undefined면 정상
  label,
  children,
}: {
  className?: string;
  error?: string;
  label?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "support_service_training_session_detail__field",
        error ? "support_service_training_session_detail__field--error" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="support_service_training_session_detail__control">
        {label}
        {children}
      </div>
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

function SessionFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      className="support_service_training_session_detail__field-label"
      htmlFor={htmlFor}
    >
      {children}
      {required ? (
        <span className="support_service_training_session_detail__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

export default function EngineeringTrainingSessionDetailForm({
  session,
}: {
  session: EngineeringTrainingSessionDetail;
}) {
  const formId = useId();
  const eventDateDisplay = session.sidebar.eventDateToAttend;
  /* Figma 1689:8145 — 유형당 Error 샘플 1개 (Text / Search / Select / Checkbox) */
  const [studentName, setStudentName] = useState<string>(FIELD_ERROR);
  const [streetSearch, setStreetSearch] = useState<string>(FIELD_ERROR);
  const [businessType, setBusinessType] = useState<string>(FIELD_ERROR);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState<string | undefined>(FIELD_ERROR);

  return (
    <form
      className="support_service_training_session_detail__form"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="support_service_training_session_detail__form-body">
        <div className="support_service_training_session_detail__form-main">
          <div className="support_service_training_session_detail__form-grid">
            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
              {/* 에러: Text — FieldShell error + TextField error */}
              <FieldShell
                error={FIELD_ERROR}
                label={
                  <SessionFieldLabel htmlFor={`${formId}-student-name`} required>
                    Student Name
                  </SessionFieldLabel>
                }
              >
                <TextField
                  id={`${formId}-student-name`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Student Name"
                  value={studentName}
                  error
                  onChange={(event) => setStudentName(event.target.value)}
                />
              </FieldShell>
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-email`} required>
                  E-mail Address
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-email`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="E-mail Address"
                  type="email"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-job-title`} required>
                  Job Title
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-job-title`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Job Title"
                />
              </div>
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-phone`} required>
                  Phone
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-phone`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Phone"
                  type="tel"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row">
              <div className="support_service_training_session_detail__field support_service_training_session_detail__field--full">
                <SessionFieldLabel htmlFor={`${formId}-company`} required>
                  Company
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-company`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Company"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--address">
              {/* 에러: Search — FieldShell error + TextField error */}
              <FieldShell
                className="support_service_training_session_detail__field--address-search"
                error={FIELD_ERROR}
                label={
                  <SessionFieldLabel htmlFor={`${formId}-street`}>
                    Street Address
                  </SessionFieldLabel>
                }
              >
                <TextField
                  id={`${formId}-street`}
                  className="guide_field guide_field--h50 guide_field--search support_service_training_session_detail__input"
                  placeholder="Keyword Search"
                  value={streetSearch}
                  error
                  onChange={(event) => setStreetSearch(event.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className="guide_field__search-adorn"
                        >
                          <button
                            type="button"
                            className="guide_field__search-icon-button"
                            aria-label="Search address"
                          >
                            <img
                              src="/pub/ico/ico_search_24.svg"
                              alt=""
                              width={18}
                              height={18}
                              loading="lazy"
                              decoding="async"
                            />
                          </button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FieldShell>
              {/* 정상: Address 2 — label 없음 → padding-top으로 Street 라벨 높이 맞춤 */}
              <div className="support_service_training_session_detail__field support_service_training_session_detail__field--address-2">
                <TextField
                  id={`${formId}-address-2`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Address 2"
                  aria-label="Address 2"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-apartment`}>
                  Apartment, suite, etc
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-apartment`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="Apartment, suite, etc"
                />
              </div>
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-city`}>City</SessionFieldLabel>
                <TextField
                  id={`${formId}-city`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-state`}>
                  State/Province
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-state`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="State/Province"
                />
              </div>
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-zip`}>
                  ZIP / Postal Code
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-zip`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input"
                  placeholder="ZIP / Postal Code"
                />
              </div>
            </div>

            <div className="support_service_training_session_detail__form-row support_service_training_session_detail__form-row--2">
              {/* 에러: Select — FieldShell error + FormControl/GuideSelect error */}
              <FieldShell
                error={FIELD_ERROR}
                label={
                  <SessionFieldLabel htmlFor={`${formId}-position`}>
                    Type of Business
                  </SessionFieldLabel>
                }
              >
                <FormControl className="guide_field guide_field--h50" error>
                  <GuideSelect
                    value={businessType}
                    error
                    IconComponent={GuideSelectIcon}
                    inputProps={{
                      "aria-label": "Position",
                      id: `${formId}-position`,
                    }}
                    onChange={(event) =>
                      setBusinessType(String(event.target.value))
                    }
                    renderValue={(value) => (
                      <span
                        className="guide_field__select-value"
                        title={String(value)}
                      >
                        {String(value)}
                      </span>
                    )}
                  >
                    {session.positionOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                    <MenuItem value={FIELD_ERROR}>{FIELD_ERROR}</MenuItem>
                  </GuideSelect>
                </FormControl>
              </FieldShell>
              <div className="support_service_training_session_detail__field">
                <SessionFieldLabel htmlFor={`${formId}-event-date`} required>
                  Event Date to Attend
                </SessionFieldLabel>
                <TextField
                  id={`${formId}-event-date`}
                  className="guide_field guide_field--h50 support_service_training_session_detail__input support_service_training_session_detail__input--readonly"
                  value={eventDateDisplay}
                  slotProps={{ input: { readOnly: true } }}
                />
              </div>
            </div>
          </div>

          <div className="support_service_training_session_detail__form-consent">
            <hr className="support_service_training_session_detail__form-divider" />

            {/* 에러: Checkbox — guide_checkbox--error + guide_checkbox__error */}
            <div
              className={[
                "support_service_training_session_detail__consent",
                consentError
                  ? "support_service_training_session_detail__consent--error"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="support_service_training_session_detail__consent-row">
                <label className="support_service_training_session_detail__consent-label">
                    <Checkbox
                    className={[
                      "guide_checkbox",
                      consentError ? "guide_checkbox--error" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disableRipple
                    checked={consentChecked}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setConsentChecked(checked);
                      /* 체크 시 에러 제거 · 해제 시 샘플 에러 복원 */
                      setConsentError(checked ? undefined : FIELD_ERROR);
                    }}
                    icon={
                      <GuideCheckboxIcon {...guideCheckboxIconsContactConsent} />
                    }
                    checkedIcon={
                      <GuideCheckboxIcon
                        checked
                        {...guideCheckboxIconsContactConsent}
                      />
                    }
                  />
                  <span>
                    Consent to Collection and Use of Personal Information
                  </span>
                </label>
                <Link
                  href="/support/contact-us/terms"
                  className="support_service_training_session_detail__terms-link"
                >
                  View Full Terms
                </Link>
              </div>
              {consentError ? (
                <p className="guide_checkbox__error" role="alert">
                  {consentError}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <img
          className="support_service_training_session_detail__recaptcha"
          src={engineeringTrainingSessionAssets.recaptcha}
          alt=""
          width={335}
          height={80}
          loading="lazy"
          decoding="async"
          aria-hidden
        />
      </div>

      <button
        type="submit"
        className="btn-base btn-lv01 btn-lv01--solid support_service_training_session_detail__submit"
      >
        {engineeringTrainingSessionFormCopy.submitLabel}
      </button>
    </form>
  );
}
