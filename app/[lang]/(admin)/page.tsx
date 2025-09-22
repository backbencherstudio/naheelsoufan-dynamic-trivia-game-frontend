import DashboardPage from "@/components/dashboard/DashboardPage";
import { getDictionary } from "../disctionaries";

export default async function Page({params}) {
  const { lang } = await params;
  console.log("lang",lang);
  
  const dictionary = await getDictionary(lang);
  return (
    <div>
      <h1>{dictionary.trending}</h1>
      <DashboardPage />
    </div>
  );
}
