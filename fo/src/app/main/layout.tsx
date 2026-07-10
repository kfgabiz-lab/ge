import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";
import { fetchGnbMenuData } from "@/data/gnb";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GNB 트리 조회(실패 시 내부에서 빈 배열 폴백 → 정적 데이터 사용)
  const gnbMenuData = await fetchGnbMenuData();

  return (
    <>
      <MainHeader gnbMenuData={gnbMenuData} />
      {children}
      <MainFooter />
    </>
  );
}
