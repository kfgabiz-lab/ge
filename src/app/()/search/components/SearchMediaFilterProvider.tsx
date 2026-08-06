"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { searchMediaTypes } from "@/data/search/searchMediaContent";
import type { DownloadActiveFilterChip } from "@/data/support/downloadCenterContent";

const MEDIA_TYPE_ID_PREFIX = "search-media-type";

type FilterMeta = {
  id: string;
  label: string;
  group: DownloadActiveFilterChip["group"];
};

function buildFilterRegistry(): FilterMeta[] {
  return searchMediaTypes.map((option) => ({
    id: `${MEDIA_TYPE_ID_PREFIX}-${option.id}`,
    label: option.label,
    group: "Types",
  }));
}

const FILTER_REGISTRY = buildFilterRegistry();

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const meta of FILTER_REGISTRY) {
    checked[meta.id] = false;
  }

  for (const option of searchMediaTypes) {
    if (option.defaultChecked) {
      checked[`${MEDIA_TYPE_ID_PREFIX}-${option.id}`] = true;
    }
  }

  return checked;
}

type SearchMediaFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearAll: () => void;
};

const SearchMediaFilterContext = createContext<SearchMediaFilterContextValue | null>(
  null,
);

export function useSearchMediaFilter() {
  const context = useContext(SearchMediaFilterContext);

  if (!context) {
    throw new Error(
      "useSearchMediaFilter must be used within SearchMediaFilterProvider",
    );
  }

  return context;
}

export function SearchMediaFilterProvider({ children }: { children: ReactNode }) {
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
    <SearchMediaFilterContext.Provider value={value}>
      {children}
    </SearchMediaFilterContext.Provider>
  );
}
