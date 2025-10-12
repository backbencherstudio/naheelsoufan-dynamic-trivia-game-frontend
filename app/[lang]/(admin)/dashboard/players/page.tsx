"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import { UserService } from '@/service/user/user.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { HiSearch } from 'react-icons/hi';

function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [usersData, setUsersData] = useState([]);
  const [totalUsersData, setTotalUsersData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useToken();
  const { t } = useTranslation();

  const endpoint = `/admin/players?page=${currentPage}&limit=${itemsPerPage}&q=${search}&sort_by=${sortBy}&sort_order=${sortOrder}&status=${filterValue}`;

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setUsersData(response.data?.data);
      setTotalUsersData(response.data?.pagination);
    } catch (err) {
      setError(err.message || t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  }, 500);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    } else {
      setSearch('');
    }
  }, [searchParams]);

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
    }
  }, [endpoint, token]);


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
      label: t("name"),
      accessor: "player_name",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("score"),
      accessor: "score",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("correct"),
      accessor: "correct_answers",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("wrong"),
      accessor: "wrong_answers",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("skipped"),
      accessor: "skipped_answers",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("users")}</h1>
      </div>

      {/* Table Section */}
      <div className="border p-2 md:p-0 rounded-lg md:pb-6 pb-6">
        <div className="md:p-5">
          {/* Filter and Search Section */}
          <div className="flex flex-col md:flex-row
           gap-4 my-4">
            {/* <div className="w-48">
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div className="md:w-48 w-68 flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='md:w-[180px] w-full !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder={t("sort_name")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>{t("sort_name")}</SelectItem>
                  <SelectItem value='score'>{t("sort_score")}</SelectItem>
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

        <DynamicTableTwo
          columns={columns}
          data={usersData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={totalUsersData}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default UsersPage;
