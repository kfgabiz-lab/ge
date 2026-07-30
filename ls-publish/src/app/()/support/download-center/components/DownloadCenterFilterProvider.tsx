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
  downloadDocumentTypes,
  downloadProductCategories,
  type DownloadActiveFilterChip,
  type DownloadCategoryOption,
} from "@/data/support/downloadCenterContent";

type FilterSection = "category" | "document";

type FilterMeta = {
  id: string;
  label: string;
  group: DownloadActiveFilterChip["group"];
  section: FilterSection;
};

const CATEGORY_ID_PREFIX = "dc-category";

function categoryId(id: string) {
  return `${CATEGORY_ID_PREFIX}-${id}`;
}

function walkCategories(
  options: DownloadCategoryOption[],
  visit: (option: DownloadCategoryOption, parent?: DownloadCategoryOption) => void,
  parent?: DownloadCategoryOption,
) {
  for (const option of options) {
    visit(option, parent);

    if (option.nested?.length) {
      walkCategories(option.nested, visit, option);
    }
  }
}

function collectDescendantIds(option: DownloadCategoryOption): string[] {
  const ids: string[] = [];

  for (const nested of option.nested ?? []) {
    ids.push(categoryId(nested.id));
    ids.push(...collectDescendantIds(nested));
  }

  return ids;
}

function buildFilterRegistry(): FilterMeta[] {
  const items: FilterMeta[] = [];

  walkCategories(downloadProductCategories, (option) => {
    items.push({
      id: categoryId(option.id),
      label: option.label,
      group: "Category",
      section: "category",
    });
  });

  for (const option of downloadDocumentTypes) {
    items.push({
      id: `dc-doc-${option.id}`,
      label: option.label,
      group: "Types",
      section: "document",
    });
  }

  return items;
}

const FILTER_REGISTRY = buildFilterRegistry();

const CATEGORY_CHILDREN_MAP = new Map<string, string[]>();
const CATEGORY_DESCENDANTS_MAP = new Map<string, string[]>();
const CATEGORY_PARENT_MAP = new Map<string, string>();

walkCategories(downloadProductCategories, (option, parent) => {
  const id = categoryId(option.id);
  const childIds = (option.nested ?? []).map((nested) => categoryId(nested.id));

  if (childIds.length) {
    CATEGORY_CHILDREN_MAP.set(id, childIds);
    CATEGORY_DESCENDANTS_MAP.set(id, collectDescendantIds(option));
  }

  if (parent) {
    CATEGORY_PARENT_MAP.set(id, categoryId(parent.id));
  }
});

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

function syncCategoryAncestors(
  next: Record<string, boolean>,
  startParentId?: string,
) {
  let parentId = startParentId;

  while (parentId) {
    syncCategoryParentState(next, parentId);
    parentId = CATEGORY_PARENT_MAP.get(parentId);
  }
}

function applyDefaultChecked(
  next: Record<string, boolean>,
  option: DownloadCategoryOption,
) {
  const id = categoryId(option.id);

  if (option.defaultChecked) {
    next[id] = true;

    for (const descendantId of CATEGORY_DESCENDANTS_MAP.get(id) ?? []) {
      next[descendantId] = true;
    }

    return;
  }

  for (const nested of option.nested ?? []) {
    applyDefaultChecked(next, nested);
  }

  syncCategoryParentState(next, id);
}

function buildInitialChecked(): Record<string, boolean> {
  const checked: Record<string, boolean> = {};

  for (const meta of FILTER_REGISTRY) {
    checked[meta.id] = false;
  }

  for (const option of downloadProductCategories) {
    applyDefaultChecked(checked, option);
    syncCategoryAncestors(checked, categoryId(option.id));
  }

  for (const option of downloadDocumentTypes) {
    if (option.defaultChecked) {
      checked[`dc-doc-${option.id}`] = true;
    }
  }

  return checked;
}

type DownloadCenterFilterContextValue = {
  isChecked: (id: string) => boolean;
  toggleFilter: (id: string, checked: boolean) => void;
  clearSection: (section: FilterSection) => void;
  clearAll: () => void;
  activeChips: DownloadActiveFilterChip[];
};

const DownloadCenterFilterContext =
  createContext<DownloadCenterFilterContextValue | null>(null);

export function useDownloadCenterFilter() {
  const context = useContext(DownloadCenterFilterContext);

  if (!context) {
    throw new Error(
      "useDownloadCenterFilter must be used within DownloadCenterFilterProvider",
    );
  }

  return context;
}

export function DownloadCenterFilterBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const context = useContext(DownloadCenterFilterContext);

  if (context) {
    return children;
  }

  return <DownloadCenterFilterProvider>{children}</DownloadCenterFilterProvider>;
}

export function DownloadCenterFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checked, setChecked] = useState(buildInitialChecked);

  const isChecked = useCallback((id: string) => Boolean(checked[id]), [checked]);

  const toggleFilter = useCallback((id: string, nextChecked: boolean) => {
    setChecked((current) => {
      const next = { ...current, [id]: nextChecked };
      const descendantIds = CATEGORY_DESCENDANTS_MAP.get(id);

      if (descendantIds) {
        for (const descendantId of descendantIds) {
          next[descendantId] = nextChecked;
        }
      }

      syncCategoryAncestors(next, CATEGORY_PARENT_MAP.get(id));

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
    <DownloadCenterFilterContext.Provider value={value}>
      {children}
    </DownloadCenterFilterContext.Provider>
  );
}
