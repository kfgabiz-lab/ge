"use client";

import {
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import { guideSearchFieldMobileSlotProps } from "@/components/form/guideFieldMobileProps";
import GuideSelect from "@/components/form/GuideSelect";

export default function CompanyArticlesListToolbar() {
  const [query, setQuery] = useState("");
  const hasQuery = query.length > 0;

  return (
    <div className="company-articles-list__toolbar">
      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue=""
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Articles month filter" }}
          renderValue={(value) => {
            const text = value ? String(value) : "Month";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Month</MenuItem>
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
        </GuideSelect>
      </FormControl>

      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue=""
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Articles year filter" }}
          renderValue={(value) => {
            const text = value ? String(value) : "Year";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="">Year</MenuItem>
          <MenuItem value="2026">2026</MenuItem>
          <MenuItem value="2025">2025</MenuItem>
        </GuideSelect>
      </FormControl>

      <TextField
        className={`guide_field guide_field--search${
          hasQuery ? " guide_field--search-filled" : ""
        }`}
        placeholder="Search"
        aria-label="Search articles"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        slotProps={{
          ...guideSearchFieldMobileSlotProps,
          input: {
            endAdornment: (
              <InputAdornment position="end" className="guide_field__search-adorn">
                {hasQuery ? (
                  <button
                    type="button"
                    className="guide_field__search-clear"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <span className="guide_field__search-clear-icon" aria-hidden>
                      <img
                        loading="lazy"
                        decoding="async"
                        src="/pub/ico/ico_clear_12_black.svg"
                        alt=""
                        width={10}
                        height={10}
                      />
                    </span>
                  </button>
                ) : null}
                <button
                  type="button"
                  className="guide_field__search-icon-button"
                  aria-label="Search"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src="/pub/ico/ico_search_24.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </button>
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl className="guide_field guide_field--w200">
        <GuideSelect
          defaultValue="Latest"
          displayEmpty
          IconComponent={GuideSelectIcon}
          inputProps={{ "aria-label": "Articles sort order" }}
          renderValue={(value) => {
            const text = value ? String(value) : "Latest";
            return (
              <span className="guide_field__select-value" title={text}>
                {text}
              </span>
            );
          }}
        >
          <MenuItem value="Latest">Latest</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
        </GuideSelect>
      </FormControl>
    </div>
  );
}
