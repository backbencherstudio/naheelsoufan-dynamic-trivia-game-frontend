
"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { HiSearch } from 'react-icons/hi';

function PreviousGamesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [gamesHistoryData, setGamesHistoryData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const {token} = useToken();
  const endpoint = `/admin/games?page=${currentPage}&limit=${itemsPerPage}&q=${search}`
  const {data , loading}= useDataFetch(endpoint)
 useEffect(() => {
  if (data?.data?.length > 0) {
    setGamesHistoryData(data?.data)
  }
  if (data) {
    setPaginationData(data?.pagination)
  }
}, [data])
  // Demo data matching the image
 console.log(gamesHistoryData);
 

  const columns = [
    {
      label: "No.",
      accessor: "no",
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    // {
    //   label: "Category",
    //   accessor: "category",
    //   width: "150px",
    //   formatter: (value: string) => (
    //     <span className="text-sm font-medium">{value}</span>
    //   ),
    // },
    {
      label: "Game Mode",
      accessor: "mode",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Host Name",
      accessor: "host",
      width: "200px",
      formatter: (value:{name: string}) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Host Email",
      accessor: "host",
      width: "200px",
      formatter: (value: {email:string}) => (
        <span className="text-sm">{value?.email}</span>
      ),
    },
    {
      label: "Players",
      accessor: "game_players",
      width: "150px",
      formatter: (value: any) => (
        <div className="text-sm">{value?.length > 0 ?
          value?.map((item: any) => item?.user?.name).join(", ")
          :0}</div>
      ),
    },
  ];

  // Search function
  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('search');
    } else {
      params.set('search', searchValue);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  // Debounced search function using the reusable hook
  const debouncedSearch = useDebounce(searchFunction, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Games History</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg  pb-6">
        <div className="p-5">
          {/* Filter and Search Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-whiteColor">Difficulties</h2>
            <div className="flex gap-4">
              <div className="w-48">
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                    <SelectValue placeholder='Topic' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='testing'>Testing</SelectItem>
                   
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                    <SelectValue placeholder='Difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='easy'>Easy</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='hard'>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-1">
                <input 
                  onChange={handleSearch}
                  type="text" 
                  placeholder="Search by host or player..." 
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <DynamicTableTwo
          columns={columns}
          data={gamesHistoryData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
         loading={loading}
        />
      </div>
    </div>
  );
}

export default PreviousGamesPage;
