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
  techHubCertifications,
  techHubProductCategories,
} from "@/data/support/techHubContent";

type FilterSection = "category" | "certification";

export type TechHubActiveFilterChip = {
  id: string;
  group: "Category" | "Certification";
  value: string;
};

type FilterMeta = {
  id: string;
  label: string;
  group: TechHubActiveFilterChip["group"];
  section: FilterSection;
};

function buildFilterRegistry(): FilterMeta[] {
  const items: FilterMeta[] = [];

  for (const option of techHubProductCategories) {
    items.push({
      id: `th-category-${option.id}`,
      label: option.label,
      group: "Category",
      section: "category",
    });

    for (const nested of option.nested ?? []) {
      items.push({
        id: `th-category-${nested.id}`,
        label: nested.label,
        group: "Category",
        section: "category",
      });
    }
  }

  for (const option of techHubCertifications) {
    items.push({
      id: `th-cert-${option.id}`,
      label: option.label,
      group: "Certification",
      section: "certification",
    });
  }

  return items;
}

const FILTER_REGISTRY = buildFilterRegistry();

const CATEGORY_CHILDREN_MAP = new Map<string, string[]>();
const CATEGORY_PARENT_MAP = new Map<string, string>();

for (const option of techHubProductCategories) {
  const parentId = `th-category-${option.id}`;
  const childIds = (option.nested ?? []).map(
    (nested) => `th-category-${nested.id}`,
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

  for (const option of techHubProductCategories) {
    const parentId = `th-category-${option.id}`;

    if (option.defaultChecked) {
      checked[parentId] = true;

      for (const nested of option.nested ?? []) {
        checked[`th-category-${nested.id}`] = true;
      }

      continue;
    }

    for (const nested of option.nested ?? []) {
      if (nested.defaultChecked) {
        checked[`th-category-${nested.id}`] = true;
      }
    }

    syncCategoryParentState(checked, parentId);
  }

  for (const option of techHubCertifications) {
    if (option.defaultChecked) {
      checked[`th-cert-${option.id}`] = true;
    }
  }

  return checked;
}

type TechHubFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: (section: FilterSection) => void;
  clearAll: () => void;
  activeChips: TechHubActiveFilterChip[];
};

const TechHubFilterContext = createContext<TechHubFilterContextValue | null>(
  null,
);

export function useTechHubFilter() {
  const context = useContext(TechHubFilterContext);

  if (!context) {
    throw new Error(
      "useTechHubFilter must be used within TechHubFilterProvider",
    );
  }

  return context;
}

export function TechHubFilterBoundary({ children }: { children: ReactNode }) {
  const context = useContext(TechHubFilterContext);

  if (context) {
    return children;
  }

  return <TechHubFilterProvider>{children}</TechHubFilterProvider>;
}

export function TechHubFilterProvider({ children }: { children: ReactNode }) {
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
    <TechHubFilterContext.Provider value={value}>
      {children}
    </TechHubFilterContext.Provider>
  );
}
