"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* 260812 start */
const AI_SKELETON_MS = 1200;

type SearchAllAiLoadingValue = {
  isAiLoading: boolean;
  startAiLoading: () => void;
};

const SearchAllAiLoadingContext = createContext<SearchAllAiLoadingValue>({
  isAiLoading: false,
  startAiLoading: () => {},
});

export function useSearchAllAiLoading() {
  return useContext(SearchAllAiLoadingContext);
}

export default function SearchAllAiLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAiLoading = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsAiLoading(true);
    timerRef.current = setTimeout(() => {
      setIsAiLoading(false);
      timerRef.current = null;
    }, AI_SKELETON_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ isAiLoading, startAiLoading }),
    [isAiLoading, startAiLoading],
  );

  return (
    <SearchAllAiLoadingContext.Provider value={value}>
      {children}
    </SearchAllAiLoadingContext.Provider>
  );
}
/* 260812 end */
