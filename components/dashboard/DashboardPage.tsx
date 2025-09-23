

import { getServerTranslations } from '@/service/getServerTranslations'
import { UserService } from '@/service/user/user.service'
import { cookies } from 'next/headers'
import Link from 'next/link'
import DashboardBanner from './DashboardBanner'
import RecentOrderTable from './RecentOrderTable'
import StatCards from './StatCards'

async function DashboardPage({ lagncode }: { lagncode: string }) {
  const cookieStore = await cookies()
  const token = cookieStore?.get("gametoken")?.value;
  const { lang, dict } = await getServerTranslations(lagncode);
  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/login" className="text-xl underline text-primaryColor text-center">{dict?.please_log_in_to_view_the_dashboard}</Link>
      </div>
    );
  }

 

  try {
     const userinfo = await UserService?.getData("/auth/me", token)

    return (
      <div className='flex flex-col justify-between h-full'>
        <DashboardBanner userinfo={userinfo?.data?.data?.name} lang={lang} dict={dict}/>
        <StatCards />
        <div>
          <RecentOrderTable  />
        </div>
       
      </div>
    )
  } catch (error: any) {
    if (error?.response?.status === 403) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-red-500">Access forbidden. Please log in again or check your permissions.</p>
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error?.message || "Something went wrong."}</p>
      </div>
    );
  }
}

export default DashboardPage
