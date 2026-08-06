 "use client";

import Link from "next/link";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { GuideSelectIcon } from "@/components/form/GuideFieldIcons";
import GuideSelect from "@/components/form/GuideSelect";
import PageNumbering from "@/components/pagination/PageNumbering";
import "@/assets/css/company.css";

type BlogItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tags: string[];
};

const HERO_BG_IMAGE = "/img/company/blog/hero_bg_blog.png";
const HERO_MAIN_IMAGE = "/img/company/blog/hero_01.png";


const blogFeatured = {
  category: "Power Distribution & Infrastructure",
  title: "Control Panel Troubleshooting Tips Every Industrial Team...",
  description:
    "Power interruptions drain an estimated $150 billion annually from the U.S. economy, and many of these costly losses start with a fault that lasts less than a second. In that brief moment, equipment can fail, production can...",
  date: "Jan 23, 2026",
  tags: [
    "#MCCB",
    "#Switches",
    "#Air Circuit Breakers",
    "#Compact Switch",
    "#Hashtag",
    "#Panel Control",
  ],
};

const blogItems: BlogItem[] = [
  {
    id: "blog-01",
    category: "Power Distribution & Infrastructure",
    title: "Control Panel Troubleshooting Tips Every Industrial Team Should Know",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_08.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-02",
    category: "Power Distribution & Infrastructure",
    title: "The Significance of Arc Resistance in Material Selection",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_01.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-03",
    category: "Power Distribution & Infrastructure",
    title: "A Complete Guide to Protective Relays and Their Role in Power Systems",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_02.png",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-04",
    category: "Power Distribution & Infrastructure",
    title: "What Is a Disconnect Switch and Why Is It Essential for Safety? ",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_03.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-05",
    category: "Power Distribution & Infrastructure",
    title: "What Is a Relay: Types, Functions, and Industrial Applications",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_04.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-06",
    category: "Power Distribution & Infrastructure",
    title: "PLC and SCADA: Understanding the Differences in Industrial Automation Systems",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_05.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-07",
    category: "Power Distribution & Infrastructure",
    title: "A Complete Guide to Protective Relays and Their Role in Power Systems",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_06.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-08",
    category: "Power Distribution & Infrastructure",
    title: "IEC 2025",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_07.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-09",
    category: "Power Distribution & Infrastructure",
    title: "Control Panel Troubleshooting Tips Every Industrial Team Should Know",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_08.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-10",
    category: "Power Distribution & Infrastructure",
    title: "DCS vs PLC: A Detailed Comparison of Control and Automation Systems",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_09.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
  {
    id: "blog-11",
    category: "Power Distribution & Infrastructure",
    title: "The Significance of Arc Resistance in Material Selection",
    description:
      "Electrical accidents remain a serious concern in industrial and commercial settings. According to the U.S. Bureau of Labor Statistics, more than 5,000 workers suffer fatal electrical injuries annually in the U.S. alone, many of which occur during maintenance or equipment servicing without proper isolation protocols in place.",
    date: "Apr 20, 2026",
    image: "/img/company/blog/list_01.jpg",
    tags: ["#MCCB", "#Switches", "#Air Circuit Breakers", "#Compact Switch", "#Hashtag", "#Hashtag"],
  },
];

const listItems = blogItems.slice(1);

function BlogTag({ label }: { label: string }) {
  return (
    <button type="button" className="company-blog__tag">
      {label}
    </button>
  );
}

export default function CompanyBlogPage() {
  return (
    <main className="company-page company-page--blog" id="Page_company_blog">
      <section className="company-blog-title">
        <div className="inner">
          <h1 className="company-blog-title__heading">Blog</h1>
          <p className="company-blog-title__desc">
            Your Knowledge Hub for Electrical Innovation
          </p>
        </div>
      </section>

      <section className="company-blog-top">
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="company-blog-top__bg"
        />
        <div className="inner">
          <div className="company-blog-featured__card">
            <div className="company-blog-featured__image">
              <img
                src={HERO_MAIN_IMAGE}
                alt={blogFeatured.title}
              />

            </div>
            <div className="company-blog-featured__content">
              <p className="company-blog-featured__category">{blogFeatured.category}</p>
              <h2 className="company-blog-featured__title">{blogFeatured.title}</h2>
              <p className="company-blog-featured__desc">{blogFeatured.description}</p>
              <p className="company-blog-featured__date">{blogFeatured.date}</p>
              <div className="company-blog-featured__tags">
                {blogFeatured.tags.map((tag) => (
                  <a key={tag} href="/company/blog/detail" className="company-blog-featured__tag">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="company-blog-list">
        <div className="inner">
          <div className="company-blog-list__toolbar">
            <FormControl className="guide_field guide_field--w200">
              <GuideSelect
                defaultValue=""
                displayEmpty
                IconComponent={GuideSelectIcon}
                inputProps={{ "aria-label": "Blog category filter" }}
                renderValue={(value) => {
                  const text = value ? String(value) : "All";
                  return (
                    <span className="guide_field__select-value" title={text}>
                      {text}
                    </span>
                  );
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Power Distribution & Infrastructure">
                  Power Distribution & Infrastructure
                </MenuItem>
                <MenuItem value="Energy Solutions">Energy Solutions</MenuItem>
                <MenuItem value="Automation Solutions">Automation Solutions</MenuItem>
              </GuideSelect>
            </FormControl>

            <TextField
              className="guide_field guide_field--search"
              placeholder="Search"
              aria-label="Search blog"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" className="guide_field__search-adorn">
                      <button
                        type="button"
                        className="guide_field__search-icon-button"
                        aria-label="Search"
                      >
                        <img
                          loading="lazy"
                          decoding="async"
                          src="/ico/ico_search_24.svg"
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
                inputProps={{ "aria-label": "Blog sort order" }}
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

          <ul className="company-blog-list__items">
            {listItems.map((item) => (
              <li key={item.id} className="company-blog-list__item">
                <div className="company-blog-list__content-wrap">
                  <div className="company-blog-list__link">
                    <div className="company-blog-list__image">
                      <Link href="/company/blog/detail" aria-label={item.title}>
                        <img src={item.image} alt={item.title} />
                      </Link>
                    </div>
                    <div className="company-blog-list__content">
                      <Link href="/company/blog/detail" className="company-blog-list__text-link">
                        <p className="company-blog__category">{item.category}</p>
                      </Link>
                      <Link href="/company/blog/detail" className="company-blog-list__text-link">
                        <h3 className="company-blog-list__title">{item.title}</h3>
                      </Link>
                      <Link href="/company/blog/detail" className="company-blog-list__text-link">
                        <p className="company-blog-list__desc">{item.description}</p>
                      </Link>
                      <Link href="/company/blog/detail" className="company-blog-list__text-link">
                        <p className="company-blog__date">{item.date}</p>
                      </Link>
                      <div className="company-blog-list__tags-row">
                    <div className="company-blog__tags">
                      {item.tags.map((tag, tagIndex) => (
                        <BlogTag key={`${item.id}-${tag}-${tagIndex}`} label={tag} />
                      ))}
                    </div>
                  </div>
                    </div>
                  </div>
         
                </div>
              </li>
            ))}
          </ul>

          <PageNumbering
            className="company-blog-list__pagination"
            currentPage={1}
            totalPages={5}
            ariaLabel="Blog pagination"
          />
        </div>
      </section>
    </main>
  );
}

