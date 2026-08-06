"use client";

import { articleDetailClass } from "@/app/()/company/articleDetailClass";
import CompanyArticleDetail from "@/app/()/company/components/CompanyArticleDetail";
import "@/assets/css/company.css";

export default function CompanyBlogDetailPage() {
  return (
    <CompanyArticleDetail
      variant="blog"
      pageId="Page_company_blog_detail"
      category="Power Distribution & Infrastructure"
      title="Why Arc Resistance Matters in Material Selection"
      date="Dec 9, 2025"
      heroImage={{
        src: "/pub/img/company/blog/hero_01.png",
        alt: "Arc resistance in electrical systems",
      }}
      pagerAriaLabel="Blog post navigation"
      prev={{
        href: "/company/articles/detail",
        title: "LS ELECTRIC to shake up the industry in the era of a Supercycle",
      }}
      next={{
        href: "/company/blog/detail",
        title:
          "LS ELECTRIC Unveils a Wide Range of Future-Oriented Manufacturing AX Solutions",
      }}
      listHref="/company/blog"
    >
      <div className={articleDetailClass("body")}>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>
          <span>
            Unexpected downtime is one of the most expensive problems facing
            industrial operations today, with unplanned outages costing
            manufacturers an estimated $50 billion annually. At the center of many
            of these disruptions are industrial control panels, complex systems
            that regulate, monitor, and automate machinery across nearly every
            sector of the economy.
          </span>
        </p>
        <p>
          <span>
            Unexpected downtime is one of the most expensive problems facing
            industrial operations today, with unplanned outages costing
            manufacturers an estimated $50 billion annually. At the center of many
            of these disruptions are industrial control panels, complex systems
            that regulate, monitor, and automate machinery across nearly every
            sector of the economy.
          </span>
        </p>
        <ul>
          <li>
            <p>
              <span>List 1</span>
            </p>
          </li>
          <li>
            <p>
              <span>List 2</span>
            </p>
          </li>
          <li>
            <p>
              <span>List 3</span>
            </p>
          </li>
          <li>
            <p>
              <span>List 4</span>
            </p>
          </li>
          <li>
            <p>
              <span>List 5</span>
            </p>
          </li>
        </ul>
        <ol>
          <li>
            <p>Order 1</p>
          </li>
          <li>
            <p>Order 2</p>
          </li>
          <li>
            <p>Order 3</p>
          </li>
        </ol>
        <p>
          <img
            src="/pub/img/company/blog/detail_content.png"
            alt="Industrial control panel sample"
          />
        </p>
        <table>
          <thead>
            <tr>
              <th>
                <p>Products</p>
              </th>
              <th>
                <p>Product Category</p>
              </th>
              <th>
                <p>Warranty from Date of Purchase</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>SCADA</p>
              </td>
              <td>
                <p>Automation</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>MV Fuse</p>
              </td>
              <td>
                <p>Automation</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Overload Relay</p>
              </td>
              <td>
                <p>Automation</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Motion &amp; Servo</p>
              </td>
              <td>
                <p>Power Orders</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>UL891 Switchboard</p>
              </td>
              <td>
                <p>Power Orders</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  GFCI
                  <br />
                  (Ground Fault Circuit Interrupter)
                </p>
              </td>
              <td>
                <p>Power Production</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>HVDC(High Voltage Direct Current Transmission System)</p>
              </td>
              <td>
                <p>Power Production</p>
              </td>
              <td>
                <p>99 years</p>
              </td>
            </tr>
          </tbody>
        </table>
   
      </div>

      <div className={articleDetailClass("tags")}>
        <div className="company-blog__tags">
          {[
            "#ArcResistance",
            "#Switchgear",
            "#MCCB",
            "#CircuitBreakers",
            "#MaterialSelection",
            "#ElectricalSafety",
          ].map((tag) => (
            <div key={tag} className="company-blog__tag">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </CompanyArticleDetail>
  );
}
