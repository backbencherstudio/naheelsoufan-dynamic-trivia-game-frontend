import DashboardPage from "@/components/dashboard/DashboardPage";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
 
  return (
    <div>
      <DashboardPage lagncode={lang} />
    </div>
  );
}
