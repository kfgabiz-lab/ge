"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  searchProductCategories,
  searchProductDocumentTypes,
} from "@/data/search/searchProductsContent";
import type { DownloadActiveFilterChip } from "@/data/support/downloadCenterContent";

const CATEGORY_ID_PREFIX = "search-product-category";
const DOCUMENT_ID_PREFIX = "search-product-doc";

type FilterSection = "category" | "document";

type FilterMeta = {
  id: string;
  label: string;
  group: DownloadActiveFilterChip["group"];
  section: FilterSection;
};

function buildFilterRegistry(): FilterMeta[] {
  const items: FilterMeta[] = [];

  for (const option of searchProductCategories) {
    items.push({
      id: `${CATEGORY_ID_PREFIX}-${option.id}`,
      label: option.label,
      group: "Category",
      section: "category",
    });

    for (const nested of option.nested ?? []) {
      items.push({
        id: `${CATEGORY_ID_PREFIX}-${nested.id}`,
        label: nested.label,
        group: "Category",
        section: "category",
      });
    }
  }

  for (const option of searchProductDocumentTypes) {
    items.push({
      id: `${DOCUMENT_ID_PREFIX}-${option.id}`,
      label: option.label,
      group: "Types",
      section: "document",
    });
  }

  return items;
}

const FILTER_REGISTRY = buildFilterRegistry();

const CATEGORY_CHILDREN_MAP = new Map<string, string[]>();
const CATEGORY_PARENT_MAP = new Map<string, string>();

for (const option of searchProductCategories) {
  const parentId = `${CATEGORY_ID_PREFIX}-${option.id}`;
  const childIds = (option.nested ?? []).map(
    (nested) => `${CATEGORY_ID_PREFIX}-${nested.id}`,
  );

  if (childIds.length === 0) {
    continue;
  }

  CATEGORY_CHILDREN_MAP.set(parentId, childIds);

  for (const childId of childIds) {
    CATEGORY_PARENT_MAP.set(childId, parentId);
  }
}

function syncCategoryParentState(
  next: Record<string, boolean>,
  parentId: string,
) {
  const childIds = CATEGORY_CHILDREN_MAP.get(parentId);

  if (!childIds?.length) {
    return;
  }

  next[parentId] = childIds.every((childId) => next[childId]);
}

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const meta of FILTER_REGISTRY) {
    checked[meta.id] = false;
  }

  for (const option of searchProductCategories) {
    const parentId = `${CATEGORY_ID_PREFIX}-${option.id}`;

    if (option.defaultChecked) {
      checked[parentId] = true;

      for (const nested of option.nested ?? []) {
        checked[`${CATEGORY_ID_PREFIX}-${nested.id}`] = true;
      }

      continue;
    }

    for (const nested of option.nested ?? []) {
      if (nested.defaultChecked) {
        checked[`${CATEGORY_ID_PREFIX}-${nested.id}`] = true;
      }
    }

    syncCategoryParentState(checked, parentId);
  }

  for (const option of searchProductDocumentTypes) {
    if (option.defaultChecked) {
      checked[`${DOCUMENT_ID_PREFIX}-${option.id}`] = true;
    }
  }

  return checked;
}

type SearchProductsFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: (section: FilterSection) => void;
  clearAll: () => void;
  activeChips: DownloadActiveFilterChip[];
};

const SearchProductsFilterContext =
  createContext<SearchProductsFilterContextValue | null>(null);

export function useSearchProductsFilter() {
  const context = useContext(SearchProductsFilterContext);

  if (!context) {
    throw new Error(
      "useSearchProductsFilter must be used within SearchProductsFilterProvider",
    );
  }

  return context;
}

export function SearchProductsFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checked, setChecked] = useState(buildInitialChecked);

  const isChecked = useCallback((id: string) => Boolean(checked[id]), [checked]);

  const toggleFilter = useCallback((id: string, nextChecked: boolean) => {
    setChecked((current) => {
      const next = { ...current, [id]: nextChecked };
      const childIds = CATEGORY_CHILDREN_MAP.get(id);

      if (childIds) {
        for (const childId of childIds) {
          next[childId] = nextChecked;
        }
      }

      const parentId = CATEGORY_PARENT_MAP.get(id);

      if (parentId) {
        syncCategoryParentState(next, parentId);
      }

      return next;
    });
  }, []);

  const clearSection = useCallback((section: FilterSection) => {
    setChecked((current) => {
      const next = { ...current };

      for (const meta of FILTER_REGISTRY) {
        if (meta.section === section) {
          next[meta.id] = false;
        }
      }

      return next;
    });
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

  const activeChips = useMemo(
    () =>
      FILTER_REGISTRY.filter((meta) => {
        if (!checked[meta.id]) {
          return false;
        }

        const parentId = CATEGORY_PARENT_MAP.get(meta.id);

        if (parentId && checked[parentId]) {
          return false;
        }

        return true;
      }).map((meta) => ({
        id: meta.id,
        group: meta.group,
        value: meta.label,
      })),
    [checked],
  );

  const value = useMemo(
    () => ({
      isChecked,
      toggleFilter,
      clearSection,
      clearAll,
      activeChips,
    }),
    [activeChips, clearAll, clearSection, isChecked, toggleFilter],
  );

  return (
    <SearchProductsFilterContext.Provider value={value}>
      {children}
    </SearchProductsFilterContext.Provider>
  );
}
