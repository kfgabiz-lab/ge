"use client";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import GuideSelect from "@/components/form/GuideSelect";
import "@/assets/css/components/CommonFooter.css";

const occupationOptions = [
  "Engineer",
  "Manager",
  "Executive",
  "Consultant",
  "Other",
];

const productOptions = ["Power Solution", "Automation Solution"];

export type SiteFooterVariant = "main" | "markets";

type SiteFooterProps = {
  variant: SiteFooterVariant;
  logoHref?: string;
};

export default function SiteFooter({
  variant,
  logoHref = "/",
}: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [products, setProducts] = useState<string[]>([]);

  const handleProductChange = (value: string, checked: boolean) => {
    setProducts((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer className={`common_footer common_footer--${variant}`}>
      <div className="inner">
        <div className="newsletter">
          <div className="txt_block">
            <h2 className="tit_newsletter">
              Subscribe Newsletter: <br />
              Efficiency, Delivered Directly.
            </h2>
            <p className="txt">
              Subscribe to receive real-world case studies, energy-saving tips,{" "}
              <br className="br_pc" />
              and optimized configuration guides tailored for your industry.
            </p>
          </div>
        </div>

        <div className="form_news">
          <form action="" onSubmit={handleSubmit}>
            <div className="row row_fields">
              <TextField
                className="footer_field field_email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <FormControl className="footer_field">
                <InputLabel id={`footer-occupation-label-${variant}`}>
                  Occupation
                </InputLabel>
                <GuideSelect
                  labelId={`footer-occupation-label-${variant}`}
                  label="Occupation"
                  value={occupation}
                  onChange={(event) =>
                    setOccupation(String(event.target.value))
                  }
                  MenuProps={{
                    slotProps: {
                      paper: {
                        className: "footer_select_menu",
                      },
                    },
                  }}
                >
                  {occupationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </GuideSelect>
              </FormControl>
            </div>

            <div className="row row_products">
              <h3 className="row_tit">Product(s) of Interest</h3>
              <FormGroup row className="product_checks">
                {productOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        className="footer_checkbox"
                        checked={products.includes(option)}
                        onChange={(event) =>
                          handleProductChange(option, event.target.checked)
                        }
                      />
                    }
                    label={option}
                    className="product_check"
                  />
                ))}
              </FormGroup>
            </div>

            <div className="btn_area">
              <button type="submit" className="btn_flat">
                Get Insights
              </button>
              <p className="warn">
                and I agree with the terms of use as described in the{" "}
                <a href="">Privacy Policy.</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="footer_bottom">
        <div className="inner">
          <Link href={logoHref} className="footer_logo">
            <img loading="lazy" decoding="async" src="/pub/img/logo_white.svg" alt="LS ELECTRIC" />
          </Link>
          <p className="copyright">
            Copyright © LS ELECTRIC Co., Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
