"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
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

  // Demo data matching the image
  const usersData = [
    { 
      no: 1, 
      name: "6", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 2, 
      name: "7", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 3, 
      name: "Noir", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 4, 
      name: "Noor", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 5, 
      name: "P1", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 6, 
      name: "P2", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 7, 
      name: "P3", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 8, 
      name: "P8", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
    { 
      no: 9, 
      name: "P9", 
      score: 0, 
      correct: 0, 
      wrong: 0, 
      skipped: 0 
    },
  ];

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
    {
      label: "Name",
      accessor: "name",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Score",
      accessor: "score",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Correct",
      accessor: "correct",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Wrong",
      accessor: "wrong",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Skipped",
      accessor: "skipped",
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
    router.replace(`${pathname}?${params.toString()}`);
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
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6">
        <div className="p-5">
          {/* Filter and Search Section */}
          <div className="flex gap-4 mb-6">
            <div className="w-48">
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
            </div>
            <div className="w-48 flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder='Sort by Name' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Sort by Name</SelectItem>
                  <SelectItem value='score'>Sort by Score</SelectItem>
                  <SelectItem value='correct'>Sort by Correct</SelectItem>
                  <SelectItem value='wrong'>Sort by Wrong</SelectItem>
                  <SelectItem value='skipped'>Sort by Skipped</SelectItem>
                </SelectContent>
              </Select>
              <button 
                onClick={toggleSortOrder}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                {sortOrder === 'asc' ? (
                  <FaArrowUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <FaArrowDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <div className="relative flex-1">
              <input 
                onChange={handleSearch}
                type="text" 
                placeholder="Search" 
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}

export default UsersPage;
