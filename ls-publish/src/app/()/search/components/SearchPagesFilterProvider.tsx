"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { searchPageTypes } from "@/data/search/searchPagesContent";

const PAGE_TYPE_ID_PREFIX = "search-page-type";

type FilterMeta = {
  id: string;
  label: string;
};

function buildFilterRegistry(): FilterMeta[] {
  return searchPageTypes.map((option) => ({
    id: `${PAGE_TYPE_ID_PREFIX}-${option.id}`,
    label: option.label,
  }));
}

const FILTER_REGISTRY = buildFilterRegistry();

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const meta of FILTER_REGISTRY) {
    checked[meta.id] = false;
  }

  for (const option of searchPageTypes) {
    if (option.defaultChecked) {
      checked[`${PAGE_TYPE_ID_PREFIX}-${option.id}`] = true;
    }
  }

  return checked;
}

type SearchPagesFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearAll: () => void;
};

const SearchPagesFilterContext =
  createContext<SearchPagesFilterContextValue | null>(null);

export function useSearchPagesFilter() {
  const context = useContext(SearchPagesFilterContext);

  if (!context) {
    throw new Error(
      "useSearchPagesFilter must be used within SearchPagesFilterProvider",
    );
  }

  return context;
}

export function SearchPagesFilterProvider({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(buildInitialChecked);

  const isChecked = useCallback((id: string) => Boolean(checked[id]), [checked]);

  const toggleFilter = useCallback((id: string, nextChecked: boolean) => {
    setChecked((current) => ({ ...current, [id]: nextChecked }));
  }, []);

  const clearAll = useCallback(() => {
    setChecked((current) => {
      const next = { ...current };

      for (const id of Object.keys(next)) {
        next[id] = false;
      }

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      isChecked,
      toggleFilter,
      clearAll,
    }),
    [clearAll, isChecked, toggleFilter],
  );

  return (
    <SearchPagesFilterContext.Provider value={value}>
      {children}
    </SearchPagesFilterContext.Provider>
  );
}
