"use client";

import { useState } from "react";
import { industryTabs } from "../data/marketsContent";

export default function MarketsExplore() {
  const [activeTab, setActiveTab] = useState(industryTabs[1]?.id ?? industryTabs[0].id);
  const active = industryTabs.find((tab) => tab.id === activeTab) ?? industryTabs[0];

  return (
    <section className="markets_explore">
      <div className="inner">
        <div className="markets_explore__head">
          <h2 className="section_tit">Explore Industries</h2>
          <p className="section_desc">
            Tailored electrical infrastructure solutions for every architectural
            requirement.
          </p>
        </div>

        <div className="markets_explore__tabs" role="tablist" aria-label="Industries">
          {industryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={
                activeTab === tab.id
                  ? "markets_explore__tab is-active"
                  : "markets_explore__tab"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="markets_explore__panel"
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
      >
        <div className="inner markets_explore__panel_inner">
          <div className="markets_explore__txt">
            <h3 className="markets_explore__panel_tit">{active.title}</h3>
            <p className="markets_explore__panel_desc">{active.description}</p>
          </div>
          <div className="markets_explore__img">
            <img loading="lazy" decoding="async" src={active.image} alt={active.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
