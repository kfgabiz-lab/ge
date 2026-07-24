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
import { useMediaQuery } from "@/components/layout/shared/useMediaQuery";
import {
  contactUsCategoryLevels,
  contactUsConsentItems,
  contactUsCountryOptions,
  contactUsFormCopy,
  contactUsInquiryTypes,
  contactUsTechnicalInquiry,
} from "@/data/support/contactUsContent";
import ContactUsTermsModal from "./ContactUsTermsModal";

const FIELD_ERROR = contactUsFormCopy.fieldError;

function renderSelectValue(label: string) {
  return (
    <span className="guide_field__select-value" title={label}>
      {label}
    </span>
  );
}

function ContactUsFieldLabel({
  children,
  required = false,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label className="support_contact_form__label" htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="support_contact_form__required" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

/**
 * 에러 / 정상 구분 (값 내용이 아니라 props로 판단) — Figma 1689:8145
 * - 에러: FieldShell `error="메시지"` + TextField/Select `error` → 빨간 보더 + helper
 * - Checkbox: `guide_checkbox--error` + `guide_checkbox__error` (체크 시 제거)
 * - 정상: `error` prop 생략
 * 가이드: `/guide/components` · docs/COMPONENT_GUIDE.md
 */
function ContactUsFieldError({ message }: { message: string }) {
  return (
    <p className="support_contact_form__error" role="alert">
      {message}
    </p>
  );
}

function ContactUsFieldShell({
  className = "",
  error,
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
        "support_contact_form__field",
        error ? "support_contact_form__field--error" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="support_contact_form__control">
        {label}
        {children}
      </div>
      {error ? <ContactUsFieldError message={error} /> : null}
    </div>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  fieldClassName = "",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fieldClassName?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <ContactUsFieldShell
      className={`support_contact_form__field--half ${fieldClassName}`.trim()}
      error={error}
      label={
        <ContactUsFieldLabel htmlFor={id} required>
          {label}
        </ContactUsFieldLabel>
      }
    >
      <TextField
        id={id}
        className="guide_field support_contact_form__input"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <button
                  type="button"
                  className="support_contact_form__password-toggle"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible((open) => !open)}
                >
                  <img
                    src={
                      visible
                        ? "/pub/ico/ico_password_on_22.png"
                        : "/pub/ico/ico_password_off_22.png"
                    }
                    alt=""
                    width={22}
                    height={22}
                  />
                </button>
              </InputAdornment>
            ),
          },
        }}
      />
    </ContactUsFieldShell>
  );
}

export default function ContactUsForm() {
  const formId = useId();
  const isMobile = useMediaQuery("(max-width: 780px)");
  const countryPlaceholder = isMobile
    ? contactUsFormCopy.countryPlaceholderMobile
    : contactUsFormCopy.countryPlaceholder;
  const sendLabel = isMobile
    ? contactUsFormCopy.sendLabelMobile
    : contactUsFormCopy.sendLabel;
  const [inquiryType, setInquiryType] = useState<
    (typeof contactUsInquiryTypes)[number]["id"]
  >(contactUsInquiryTypes[0].id);
  /* Figma 1689:8145 — 유형당 Error 샘플 1개 (Select Lv1 / Text / Textarea / Password / Checkbox) */
  const [categoryLv1, setCategoryLv1] = useState<string>(FIELD_ERROR);
  const [email, setEmail] = useState<string>(FIELD_ERROR);
  const [details, setDetails] = useState<string>(FIELD_ERROR);
  const [password, setPassword] = useState<string>(FIELD_ERROR);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [personalConsentChecked, setPersonalConsentChecked] = useState(false);
  const [personalConsentError, setPersonalConsentError] = useState<
    string | undefined
  >(FIELD_ERROR);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <section className="support_contact_form" id="support-contact-form">
      <div className="inner">
        <form
          className="support_contact_form__panel"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_contact_form__body">
            <fieldset className="support_contact_form__group support_contact_form__group--inquiry">
              <legend className="ir">{contactUsFormCopy.inquiryType}</legend>
              <div className="support_contact_form__inquiry-fields">
                <ContactUsFieldLabel required>
                  {contactUsFormCopy.inquiryType}
                </ContactUsFieldLabel>
                <div
                  className="support_contact_form__radios"
                  role="radiogroup"
                  aria-label={contactUsFormCopy.inquiryType}
                >
                  {contactUsInquiryTypes.map((option) => {
                    const inputId = `${formId}-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        className="support_contact_form__radio-label"
                        htmlFor={inputId}
                      >
                        <input
                          id={inputId}
                          className="support_contact_form__radio"
                          type="radio"
                          name={`${formId}-inquiry-type`}
                          value={option.id}
                          checked={inquiryType === option.id}
                          onChange={() => setInquiryType(option.id)}
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <Link
                href={contactUsTechnicalInquiry.href}
                className="btn-text-30 support_contact_form__external-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactUsTechnicalInquiry.label}
                <span className="btn-text-30__icon">
                  <span className="icon_link-14" aria-hidden />
                </span>
              </Link>
            </fieldset>

            <div className="support_contact_form__row support_contact_form__row--category">
              {/* 에러: Select — Product Category 1번째(Lv1) */}
              <ContactUsFieldShell
                className="support_contact_form__field--category"
                error={FIELD_ERROR}
                label={
                  <ContactUsFieldLabel>
                    {contactUsFormCopy.productCategory}
                  </ContactUsFieldLabel>
                }
              >
                <FormControl className="guide_field" error>
                  <GuideSelect
                    value={categoryLv1}
                    displayEmpty
                    error
                    IconComponent={GuideSelectIcon}
                    inputProps={{
                      "aria-label": contactUsCategoryLevels[0].ariaLabel,
                    }}
                    onChange={(event) =>
                      setCategoryLv1(String(event.target.value))
                    }
                    renderValue={(value) => {
                      const label = value
                        ? String(value)
                        : contactUsCategoryLevels[0].label;
                      return renderSelectValue(label);
                    }}
                  >
                    <MenuItem value="" disabled>
                      {contactUsCategoryLevels[0].label}
                    </MenuItem>
                    <MenuItem value={contactUsCategoryLevels[0].label}>
                      {contactUsCategoryLevels[0].label}
                    </MenuItem>
                    <MenuItem value={FIELD_ERROR}>{FIELD_ERROR}</MenuItem>
                  </GuideSelect>
                </FormControl>
              </ContactUsFieldShell>
              {contactUsCategoryLevels.slice(1).map((level) => (
                <FormControl
                  key={level.id}
                  className="guide_field support_contact_form__category-select"
                >
                  <GuideSelect
                    defaultValue=""
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": level.ariaLabel }}
                    renderValue={(value) => {
                      const label = value ? String(value) : level.label;
                      return renderSelectValue(label);
                    }}
                  >
                    <MenuItem value="" disabled>
                      {level.label}
                    </MenuItem>
                    <MenuItem value={level.label}>{level.label}</MenuItem>
                  </GuideSelect>
                </FormControl>
              ))}
            </div>

            <div className="support_contact_form__row support_contact_form__row--3 support_contact_form__row--contact">
              {/* 에러: Text — FieldShell error + TextField error */}
              <ContactUsFieldShell
                className="support_contact_form__field--third support_contact_form__field--email"
                error={FIELD_ERROR}
                label={
                  <ContactUsFieldLabel htmlFor={`${formId}-email`} required>
                    {contactUsFormCopy.email}
                  </ContactUsFieldLabel>
                }
              >
                <TextField
                  id={`${formId}-email`}
                  className="guide_field support_contact_form__input"
                  value={email}
                  error
                  onChange={(event) => setEmail(event.target.value)}
                />
              </ContactUsFieldShell>
              {(
                [
                  { id: "first-name", label: contactUsFormCopy.firstName },
                  { id: "last-name", label: contactUsFormCopy.lastName },
                ] as const
              ).map((field) => (
                <div
                  key={field.id}
                  className={`support_contact_form__field support_contact_form__field--third support_contact_form__field--${field.id}`}
                >
                  <ContactUsFieldLabel
                    htmlFor={`${formId}-${field.id}`}
                    required
                  >
                    {field.label}
                  </ContactUsFieldLabel>
                  <TextField
                    id={`${formId}-${field.id}`}
                    className="guide_field support_contact_form__input"
                  />
                </div>
              ))}
            </div>

            <div className="support_contact_form__row support_contact_form__row--company-country">
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--company">
                <ContactUsFieldLabel htmlFor={`${formId}-company`} required>
                  {contactUsFormCopy.companyName}
                </ContactUsFieldLabel>
                <TextField
                  id={`${formId}-company`}
                  className="guide_field support_contact_form__input"
                />
              </div>
              <div className="support_contact_form__field support_contact_form__field--half support_contact_form__field--country">
                <ContactUsFieldLabel required>
                  {contactUsFormCopy.country}
                </ContactUsFieldLabel>
                <FormControl className="guide_field">
                  <GuideSelect
                    defaultValue=""
                    displayEmpty
                    IconComponent={GuideSelectIcon}
                    inputProps={{ "aria-label": contactUsFormCopy.country }}
                    renderValue={(value) => {
                      const label = value
                        ? (contactUsCountryOptions.find(
                            (item) => item.value === value,
                          )?.label ?? String(value))
                        : countryPlaceholder;
                      return (
                        <span
                          className={
                            value
                              ? "guide_field__select-value"
                              : countryPlaceholder
                                ? "guide_field__select-value guide_field__select-value--default"
                                : "guide_field__select-value"
                          }
                          title={label}
                        >
                          {label}
                        </span>
                      );
                    }}
                  >
                    {countryPlaceholder ? (
                      <MenuItem value="" disabled>
                        {countryPlaceholder}
                      </MenuItem>
                    ) : (
                      <MenuItem value="" sx={{ display: "none" }}>
                        {" "}
                      </MenuItem>
                    )}
                    {contactUsCountryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </GuideSelect>
                </FormControl>
              </div>
            </div>

            <div className="support_contact_form__group support_contact_form__group--details">
              {/* 에러: Textarea — FieldShell error + TextField multiline error */}
              <ContactUsFieldShell
                error={FIELD_ERROR}
                label={
                  <ContactUsFieldLabel htmlFor={`${formId}-details`} required>
                    {contactUsFormCopy.inquiryDetails}
                  </ContactUsFieldLabel>
                }
              >
                <TextField
                  id={`${formId}-details`}
                  className="guide_field support_contact_form__input support_contact_form__input--textarea"
                  placeholder={contactUsFormCopy.inquiryDetailsPlaceholder}
                  multiline
                  minRows={5}
                  value={details}
                  error
                  onChange={(event) => setDetails(event.target.value)}
                />
              </ContactUsFieldShell>
            </div>

            <div className="support_contact_form__row support_contact_form__row--password">
              {/* 에러: Password — PasswordField error (Confirm은 정상) */}
              <PasswordField
                id={`${formId}-password`}
                label={contactUsFormCopy.password}
                placeholder={contactUsFormCopy.passwordPlaceholder}
                value={password}
                onChange={setPassword}
                error={FIELD_ERROR}
                fieldClassName="support_contact_form__field--password"
              />
              {/* 정상: Confirm Password — error 없음 */}
              <PasswordField
                id={`${formId}-confirm-password`}
                label={contactUsFormCopy.confirmPassword}
                placeholder={contactUsFormCopy.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={setConfirmPassword}
                fieldClassName="support_contact_form__field--confirm-password"
              />
            </div>

            <div className="support_contact_form__consent">
              <hr className="support_contact_form__divider" />
              <div className="support_contact_form__consent-items">
                {contactUsConsentItems.map((item) => {
                  const checkboxId = `${formId}-${item.id}`;
                  const isPersonalInfo = item.id === "personal-info";
                  /* 에러: Checkbox — guide_checkbox--error + guide_checkbox__error (체크 시 제거) */
                  const consentError = isPersonalInfo
                    ? personalConsentError
                    : undefined;

                  return (
                    <div
                      key={item.id}
                      className={[
                        "support_contact_form__consent-row",
                        consentError
                          ? "support_contact_form__consent-row--error"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="support_contact_form__consent-row-main">
                        <label
                          className="support_contact_form__consent-label"
                          htmlFor={checkboxId}
                        >
                          <Checkbox
                            className={[
                              "guide_checkbox",
                              consentError ? "guide_checkbox--error" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            {...(isPersonalInfo
                              ? {
                                  checked: personalConsentChecked,
                                  onChange: (
                                    _event: unknown,
                                    checked: boolean,
                                  ) => {
                                    setPersonalConsentChecked(checked);
                                    /* 체크 시 에러 제거 · 해제 시 샘플 에러 복원 */
                                    setPersonalConsentError(
                                      checked ? undefined : FIELD_ERROR,
                                    );
                                  },
                                }
                              : { defaultChecked: item.defaultChecked })}
                            disableRipple
                            icon={
                              <GuideCheckboxIcon
                                {...guideCheckboxIconsContactConsent}
                              />
                            }
                            checkedIcon={
                              <GuideCheckboxIcon
                                checked
                                {...guideCheckboxIconsContactConsent}
                              />
                            }
                            slotProps={{
                              input: { id: checkboxId, name: item.id },
                            }}
                          />
                          <span>
                            {item.label}
                            {"required" in item && item.required ? (
                              <span
                                className="support_contact_form__required"
                                aria-hidden
                              >
                                {" "}
                                *
                              </span>
                            ) : null}
                          </span>
                        </label>
                        {item.termsHref ? (
                          <Link
                            href={item.termsHref}
                            className="support_contact_form__terms-link"
                          >
                            {item.termsLabel}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="support_contact_form__terms-link"
                            onClick={() => setTermsModalOpen(true)}
                          >
                            {item.termsLabel}
                          </button>
                        )}
                      </div>
                      {consentError ? (
                        <p className="guide_checkbox__error" role="alert">
                          {consentError}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="support_contact_form__submit-wrap">
            <button
              type="submit"
              className="btn-base btn-lv01 btn-lv01--solid support_contact_form__submit"
            >
              {sendLabel}
            </button>
          </div>
        </form>
      </div>
      <ContactUsTermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </section>
  );
}
