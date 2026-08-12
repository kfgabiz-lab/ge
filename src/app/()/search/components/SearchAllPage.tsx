/* 260812 start */
import SearchAllAiLoadingProvider from "./SearchAllAiLoadingProvider";
/* 260812 end */
import SearchAllHero from "./SearchAllHero";
import SearchAllTabContent from "./SearchAllTabContent";

/** page.tsx 에서 Hero 는 Suspense 로 분리 — 조합 참고용 */
export default function SearchAllPage() {
  return (
    /* 260812 start */
    <SearchAllAiLoadingProvider>
      <SearchAllHero />
      <SearchAllTabContent />
    </SearchAllAiLoadingProvider>
    /* 260812 end */
  );
}
