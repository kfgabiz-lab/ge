import MainLayoutShell from "./MainLayoutShell";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayoutShell>{children}</MainLayoutShell>;
}
