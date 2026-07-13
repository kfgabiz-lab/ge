"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import GnbMobileMenuPanel from "@/components/layout/shared/GnbMobileMenuPanel";
import "@/assets/css/components/gnb.css";

const gnbNavItems = [
  { label: "Products & Systems", href: "/products-systems/motor-control" },
  { label: "Markets", href: "/markets/commercial-residential" },
  { label: "Services", href: "" },
  { label: "Support", href: "" },
  { label: "Company", href: "" },
];

const SCROLL_THRESHOLD = 3;

function getHeaderClassName(isAtTop: boolean, isHeaderHidden: boolean) {
  const classes = ["gnb_menu_wrap", "main"];

  if (isAtTop) {
    classes.push("is-top");
  } else {
    classes.push("is-invert");
  }

  if (isHeaderHidden) {
    classes.push("is-hidden");
  }

  return classes.join(" ");
}

export default function MegaMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY <= SCROLL_THRESHOLD;

      setIsAtTop(atTop);

      if (isMobileMenuOpen) {
        setIsHeaderHidden(false);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (atTop) {
        setIsHeaderHidden(false);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollYRef.current) {
        setIsHeaderHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <header className={getHeaderClassName(isAtTop, isHeaderHidden)}>
      <div className="gnb_menu_inner">
        <h1 className="logo">
          <Link href="/">
            <img loading="eager" decoding="async" src="/pub/img/logo_white.svg" alt="LS ELECTRIC" />
          </Link>
        </h1>

        <nav className="gnb_nav_wrap" aria-label="주 메뉴">
          <ul className="gnb_nav_list">
            {gnbNavItems.map((item) => (
              <li key={item.label} className="depth_1">
                <a href={item.href} className="link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="btn_area btn_area--desktop">
          <button type="button" className="btn_search">
            <p className="ir">search</p>
            <span className="icon_search" />
          </button>
          <button type="button" className="btn_global">
            <p className="ir">global</p>
            <span className="icon_global" />
          </button>
        </div>

        <div className="btn_area btn_area--mobile">
          <button type="button" className="btn_search">
            <p className="ir">search</p>
            <span className="icon_search" />
          </button>
          <button
            type="button"
            className={isMobileMenuOpen ? "btn_menu is-active" : "btn_menu"}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="gnb-mobile-menu"
            onClick={toggleMobileMenu}
          >
            <p className="ir">{isMobileMenuOpen ? "close menu" : "open menu"}</p>
            <span className="icon_menu" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="gnb-mobile-menu"
        className={
          isMobileMenuOpen ? "gnb_mobile_menu is-open" : "gnb_mobile_menu"
        }
        aria-label="모바일 메뉴"
        aria-hidden={!isMobileMenuOpen}
      >
        <GnbMobileMenuPanel isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </nav>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="gnb_mobile_dim"
          aria-label="메뉴 닫기"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}
