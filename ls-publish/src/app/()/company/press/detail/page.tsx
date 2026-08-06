"use client";

import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import {
  pressDetailBullets,
  pressDetailDate,
  pressDetailHero,
  pressDetailPager,
  pressDetailParagraphs,
  pressDetailTitle,
} from "@/app/()/company/data/pressDetailContent";
import "@/assets/css/company.css";

export default function CompanyPressDetailPage() {
  return (
    <CompanyArticleDetail
      variant="press"
      pageId="Page_company_press_detail"
      title={pressDetailTitle}
      date={pressDetailDate}
      heroImage={pressDetailHero}
      pagerAriaLabel="Press post navigation"
      prev={pressDetailPager.prev}
      next={pressDetailPager.next}
      listHref="/company/press"
    >
      <div className={articleDetailClass("body")}>
        <ul className={articleDetailClass("list")}>
          {pressDetailBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {pressDetailParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </CompanyArticleDetail>
  );
}
