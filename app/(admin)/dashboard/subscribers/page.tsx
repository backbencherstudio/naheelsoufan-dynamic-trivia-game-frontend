
"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { HiSearch } from 'react-icons/hi';

function HostsPage() {
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
  const hostsData = [
    { 
      no: 1, 
      fullName: "CS LECTURE", 
      email: "lecturecs41@gmail.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "Yes" 
    },
    { 
      no: 2, 
      fullName: "game", 
      email: "test@spamok.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "No" 
    },
    { 
      no: 3, 
      fullName: "walid test", 
      email: "vialabtest1@gmail.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "No" 
    },
    { 
      no: 4, 
      fullName: "wkh929@gmail.com", 
      email: "wkh929@gmail.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "No" 
    },
    { 
      no: 5, 
      fullName: "John Doe", 
      email: "john.doe@example.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "Yes" 
    },
    { 
      no: 6, 
      fullName: "Jane Smith", 
      email: "jane.smith@example.com", 
      games: 0, 
      questions: 0, 
      players: 0, 
      price: 0, 
      freeTrial: "No" 
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
      label: "Full Name",
      accessor: "fullName",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Email",
      accessor: "email",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Games",
      accessor: "games",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Questions",
      accessor: "questions",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Players",
      accessor: "players",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Price",
      accessor: "price",
      width: "100px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Free Trial",
      accessor: "freeTrial",
      width: "100px",
      formatter: (value: string) => (
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
        <h1 className="text-2xl font-semibold text-gray-900">Hosts</h1>
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
                  <SelectItem value='free-trial'>Free Trial</SelectItem>
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
                  <SelectItem value='email'>Sort by Email</SelectItem>
                  <SelectItem value='games'>Sort by Games</SelectItem>
                  <SelectItem value='questions'>Sort by Questions</SelectItem>
                  <SelectItem value='players'>Sort by Players</SelectItem>
                  <SelectItem value='price'>Sort by Price</SelectItem>
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
          data={hostsData}
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

export default HostsPage;
