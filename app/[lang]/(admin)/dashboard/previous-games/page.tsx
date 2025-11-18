
"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetPreviousGameQuery } from '@/feature/api/apiSlice';
import { useDebounce } from '@/helper/debounce.helper';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';

function PreviousGamesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [gamesHistoryData, setGamesHistoryData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { t } = useTranslation()
  const [topicFilter, setTopicFilter] = useState('');
  const buildQueryParams = (searchValue = '') => {
    const params = new URLSearchParams();
    params.append('limit', itemsPerPage.toString());
    params.append('page', currentPage.toString());
    if (searchValue) params.append('q', searchValue);
    if (sortOrder) params.append('order', sortOrder);
    if (topicFilter && topicFilter !== 'all') params.append('mode', topicFilter);
    return params.toString();
  };

  const { data, isLoading } = useGetPreviousGameQuery({ params: buildQueryParams(search) })
  useEffect(() => {
    if (data) {
      setGamesHistoryData(data?.data)
      setPaginationData(data?.pagination)
    }
  }, [data]);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
      setCurrentPage(1);
    } else {
      setSearch(''); // Clear search if no URL parameter
    }
  }, [searchParams]);

  const columns = [
    {
      label: t("no"),
      accessor: "no",
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },

    {
      label: t("game_mode"),
      accessor: "mode",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("game_id"),
      accessor: "id",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("host_name"),
      accessor: "host",
      width: "200px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("host_email"),
      accessor: "host",
      width: "200px",
      formatter: (value: { email: string }) => (
        <span className="text-sm">{value?.email}</span>
      ),
    },
    {
      label: t("players"),
      accessor: "game_players",
      width: "150px",
      formatter: (value: any) => (
        <div className="text-sm">{value?.length > 0 ?
          value?.map((item: any) => item?.player_name).join(", ")
          : 0}</div>
      ),
    },
    {
      label: t("created_at"),
      accessor: "created_at",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{dayjs(value).format("DD MMMM YYYY")}</span>
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
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Debounced search function using the reusable hook
  const debouncedSearch = useDebounce(searchFunction, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("games_history")}</h1>
      </div>

      {/* Table Section */}
      <div className="border p-2 md:p-0 rounded-lg md:pb-6 pb-6">
        <div className="md:p-5">
          {/* Filter and Search Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-whiteColor">{t("search_games")}</h2>
            <div className="flex gap-4">
              <div className="md:w-48 w-68 flex items-center gap-2">
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                    <SelectValue placeholder={t("game_mode")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>{t("all")}</SelectItem>
                    <SelectItem value='QUICK_GAME'>QUICK GAME</SelectItem>
                    <SelectItem value='GRID_STYLE'>GRID STYLE</SelectItem>

                  </SelectContent>
                </Select>
                <button
                  onClick={toggleSortOrder}
                  className="p-2 hover:bg-gray-100 rounded-md dark:hover:bg-whiteColor/20"
                >
                  {sortOrder === 'asc' ? (
                    <FaArrowUp className="w-4 h-4 text-gray-600 dark:text-whiteColor" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 text-gray-600 dark:text-whiteColor" />
                  )}
                </button>
              </div>

              <div className="relative flex-1">
                <input
                  value={search}
                  onChange={handleSearch}
                  type="text"
                  placeholder={t("search_games_placeholder")}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
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
          paginationData={paginationData}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default PreviousGamesPage;
