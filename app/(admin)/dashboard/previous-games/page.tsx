
"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
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

  // Demo data matching the image
  const gamesHistoryData = [
    { 
      no: 1, 
      category: "testing", 
      difficulty: "Easy", 
      hostName: "wkh929@gmail.com", 
      hostEmail: "wkh929@gmail.com", 
      players: "P1, P2" 
    },
    { 
      no: 2, 
      category: "Geography", 
      difficulty: "Easy", 
      hostName: "game", 
      hostEmail: "test@spamok.com", 
      players: "Player1, Player2" 
    },
    { 
      no: 3, 
      category: "Cosmetics", 
      difficulty: "Easy", 
      hostName: "wkh929@gmail.com", 
      hostEmail: "wkh929@gmail.com", 
      players: "P1, P2" 
    },
    { 
      no: 4, 
      category: "General Knowledge", 
      difficulty: "Easy", 
      hostName: "game", 
      hostEmail: "test@spamok.com", 
      players: "Pd, Pj" 
    },
    { 
      no: 5, 
      category: "Maps", 
      difficulty: "Easy", 
      hostName: "game", 
      hostEmail: "test@spamok.com", 
      players: "Pw, Pd" 
    },
    { 
      no: 6, 
      category: "testing", 
      difficulty: "Easy", 
      hostName: "walid test", 
      hostEmail: "vialabtest1@gmail.com", 
      players: "P1, P2" 
    },
    { 
      no: 7, 
      category: "Geography", 
      difficulty: "Easy", 
      hostName: "game", 
      hostEmail: "test@spamok.com", 
      players: "Player1, Player2" 
    },
    { 
      no: 8, 
      category: "Science", 
      difficulty: "Medium", 
      hostName: "john.doe@example.com", 
      hostEmail: "john.doe@example.com", 
      players: "Alice, Bob, Charlie" 
    },
    { 
      no: 9, 
      category: "History", 
      difficulty: "Hard", 
      hostName: "history.master@test.com", 
      hostEmail: "history.master@test.com", 
      players: "David, Eve" 
    },
    { 
      no: 10, 
      category: "Sports", 
      difficulty: "Easy", 
      hostName: "sports.fan@example.com", 
      hostEmail: "sports.fan@example.com", 
      players: "Frank, Grace, Henry" 
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
      label: "Category",
      accessor: "category",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Difficulty",
      accessor: "difficulty",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Host Name",
      accessor: "hostName",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Host Email",
      accessor: "hostEmail",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Players",
      accessor: "players",
      width: "150px",
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
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}

export default PreviousGamesPage;
