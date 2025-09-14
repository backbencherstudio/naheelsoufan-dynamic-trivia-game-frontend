

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
    return (
      <div className='flex flex-col justify-between h-full'>
        <DashboardBanner/>
        <StatCards />
        <div>
          <RecentOrderTable />
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
