"use client";

import { InputAdornment, TextField } from "@mui/material";
import { useId, useState } from "react";
import {
  requestForTrainingStep1Copy,
  requestForTrainingTypeOptions,
} from "@/data/services/requestForTrainingContent";
import RequestForTrainingFieldLabel from "./RequestForTrainingFieldLabel";
import RequestForTrainingQuestionnaireIntro from "./RequestForTrainingQuestionnaireIntro";

export default function RequestForTrainingStep1Form() {
  const formId = useId();
  const { fields } = requestForTrainingStep1Copy;
  type TrainingTypeId = (typeof requestForTrainingTypeOptions)[number]["id"];
  const [trainingTrack, setTrainingTrack] = useState<TrainingTypeId>(
    requestForTrainingTypeOptions[0].id,
  );

  return (
    <div className="support_service_training_request__panel">
      <div className="support_service_training_request__panel-inner">
        <RequestForTrainingQuestionnaireIntro />

        <form
          className="support_service_training_request__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="support_service_training_request__form-grid">
            <div className="support_service_training_request__field support_service_training_request__field--full support_service_training_request__field--track">
              <RequestForTrainingFieldLabel required>
                {fields.trainingTrack.label}
              </RequestForTrainingFieldLabel>
              <div
                className="support_service_training_request__radios"
                role="radiogroup"
                aria-label={fields.trainingTrack.label}
              >
                {requestForTrainingTypeOptions.map((option) => {
                  const inputId = `${formId}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      className="support_service_training_request__radio-label"
                      htmlFor={inputId}
                    >
                      <input
                        id={inputId}
                        className="support_service_training_request__radio"
                        type="radio"
                        name={`${formId}-training-track`}
                        value={option.id}
                        checked={trainingTrack === option.id}
                        onChange={() => setTrainingTrack(option.id)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-first-name`} required>
                  {fields.firstName.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-first-name`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.firstName.placeholder}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-last-name`}>
                  {fields.lastName.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-last-name`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.lastName.placeholder}
                />
              </div>
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-company`} required>
                {fields.company.label}
              </RequestForTrainingFieldLabel>
              <TextField
                id={`${formId}-company`}
                className="guide_field guide_field--h50 support_service_training_request__input"
                placeholder={fields.company.placeholder}
              />
            </div>

            <div className="support_service_training_request__field support_service_training_request__field--full">
              <RequestForTrainingFieldLabel htmlFor={`${formId}-street`} required>
                {fields.streetAddress.label}
              </RequestForTrainingFieldLabel>
              <div className="support_service_training_request__form-row support_service_training_request__form-row--address">
                <TextField
                  id={`${formId}-street`}
                  className="guide_field guide_field--h50 guide_field--search support_service_training_request__input support_service_training_request__input--search"
                  placeholder={fields.streetAddress.searchPlaceholder}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end" className="guide_field__search-adorn">
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
                <TextField
                  id={`${formId}-address-2`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.streetAddress.address2Placeholder}
                  aria-label={fields.streetAddress.address2Placeholder}
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-city`} required>
                  {fields.city.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-city`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.city.placeholder}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-state`} required>
                  {fields.state.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-state`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.state.placeholder}
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-zip`} required>
                  {fields.zip.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-zip`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.zip.placeholder}
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-phone`} required>
                  {fields.phone.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-phone`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.phone.placeholder}
                  type="tel"
                />
              </div>
            </div>

            <div className="support_service_training_request__form-row support_service_training_request__form-row--2">
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-cell-phone`}>
                  {fields.cellPhone.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-cell-phone`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.cellPhone.placeholder}
                  type="tel"
                />
              </div>
              <div className="support_service_training_request__field">
                <RequestForTrainingFieldLabel htmlFor={`${formId}-sales-contact`}>
                  {fields.salesContact.label}
                </RequestForTrainingFieldLabel>
                <TextField
                  id={`${formId}-sales-contact`}
                  className="guide_field guide_field--h50 support_service_training_request__input"
                  placeholder={fields.salesContact.placeholder}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
