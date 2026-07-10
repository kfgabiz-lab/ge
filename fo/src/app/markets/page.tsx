import { redirect } from "next/navigation";

// /markets 루트 접근 시 기본 마켓 페이지로 리다이렉트
export default function MarketsPage() {
  redirect("/markets/commercial-residential");
}
