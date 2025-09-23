import DashboardPage from "@/components/dashboard/DashboardPage";

export default async function Page({params}) {
  const { lang } = await params;
  console.log("lang",lang);
  
  return (
    <div>
      <DashboardPage lagncode={lang} />
    </div>
  );
}
