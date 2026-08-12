"use client";

import Link from "next/link";
import CompanyBlogEmpty from "@/app/()/company/components/CompanyBlogEmpty";
import CompanyBlogListToolbar from "@/app/()/company/components/CompanyBlogListToolbar";
import {
  blogFeatured,
  blogHeroBgImage,
  blogHeroMainImage,
  blogItems,
  type BlogListItem,
} from "@/app/()/company/data/blogListContent";
import PageNumbering from "@/components/pagination/PageNumbering";
import "@/assets/css/company.css";

function BlogTag({ label }: { label: string }) {
  return (
    <a href="#" className="company-blog__tag">
      {label}
    </a>
  );
}

type CompanyBlogPageProps = {
  empty?: boolean;
  pageId?: string;
  listItems?: BlogListItem[];
  currentPage?: number;
  totalPages?: number;
};

export default function CompanyBlogPage({
  empty = false,
  pageId = "Page_company_blog",
  listItems = blogItems.slice(1),
  currentPage = 1,
  totalPages = 5,
}: CompanyBlogPageProps) {
  const listSectionClass = empty
    ? "company-blog-list company-blog-list--no-data"
    : "company-blog-list";

  return (
    <main className="company-page company-page--blog" id={pageId}>
      <section className="company-blog-title">
        <div className="inner">
          <h1 className="company-blog-title__heading">Blog</h1>
          <p className="company-blog-title__desc">
            Your Knowledge Hub for Electrical Innovation
          </p>
        </div>
      </section>

      <section className="company-blog-top">
        <img src={blogHeroBgImage} alt="" className="company-blog-top__bg" />
        <div className="inner">
          <div className="company-blog-featured__card">
            <Link href="/company/blog/detail" className="company-blog-featured__image">
              <img src={blogHeroMainImage} alt={blogFeatured.title} />
            </Link>
            <div className="company-blog-featured__content">
              <Link href="/company/blog/detail" className="company-blog-featured__text">
                <p className="company-blog-featured__category">{blogFeatured.category}</p>
                <h2 className="company-blog-featured__title">{blogFeatured.title}</h2>
                <p className="company-blog-featured__desc">{blogFeatured.description}</p>
                <p className="company-blog-featured__date">{blogFeatured.date}</p>
              </Link>
              <div className="company-blog-featured__tags">
                {blogFeatured.tags.map((tag) => (
                  <a key={tag} href="#" className="company-blog-featured__tag">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={listSectionClass}>
        <div className="inner">
          <CompanyBlogListToolbar />

          <div className="company-blog-list__body">
            {empty ? (
              <CompanyBlogEmpty />
            ) : (
              <>
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
                          <div
                            className={
                              item.tags.length > 0
                                ? "company-blog-list__content"
                                : "company-blog-list__content company-blog-list__content--no-tags"
                            }
                          >
                            <Link href="/company/blog/detail" className="company-blog-list__content-link">
                              <p className="company-blog__category">{item.category}</p>
                              <h3 className="company-blog-list__title">{item.title}</h3>
                              <p className="company-blog-list__desc">{item.description}</p>
                              <p className="company-blog__date">{item.date}</p>
                            </Link>
                            {/* 260812 start */}
                            {item.tags.length > 0 ? (
                              <div className="company-blog-list__tags-row">
                                <div className="company-blog__tags">
                                  {item.tags.map((tag, tagIndex) => (
                                    <BlogTag
                                      key={`${item.id}-${tag}-${tagIndex}`}
                                      label={tag}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {/* 260812 end */}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <PageNumbering
                  className="company-blog-list__pagination"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  ariaLabel="Blog pagination"
                />
              </>
            )}
          </div>

          {empty ? <div className="company-blog-list__divider" aria-hidden="true" /> : null}
        </div>
      </section>
    </main>
  );
}
