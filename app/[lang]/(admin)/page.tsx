import DashboardPage from "@/components/dashboard/DashboardPage";

export default async function Page({params}) {
  const { lang } = await params;
 
  return (
    <div>
      <DashboardPage lagncode={lang} />
    </div>
  );
}
