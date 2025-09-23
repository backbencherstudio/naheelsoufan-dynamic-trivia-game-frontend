

import LanguageNavigationDemo from '@/components/example/LanguageNavigationDemo'
import TranslationExample from '@/components/example/TranslationExample'
import { UserService } from '@/service/user/user.service'
import { cookies } from 'next/headers'
import Link from 'next/link'
import DashboardBanner from './DashboardBanner'
import RecentOrderTable from './RecentOrderTable'
import StatCards from './StatCards'

async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore?.get("gametoken")?.value;

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/login" className="text-xl underline text-primaryColor text-center">Please log in to view the dashboard</Link>
      </div>
    );
  }

 

  try {
     const userinfo = await UserService?.getData("/auth/me", token)

    return (
      <div className='flex flex-col justify-between h-full'>
        <DashboardBanner userinfo={userinfo?.data?.data?.name}/>
        <StatCards />
        <div>
          <RecentOrderTable />
        </div>
        {/* Translation Example - Remove this in production */}
        <div className="mt-8 space-y-6">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Dynamic Translation Example:</h3>
            <TranslationExample />
          </div>
          
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="text-lg font-semibold mb-4">Language Navigation Demo:</h3>
            <LanguageNavigationDemo />
          </div>
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
