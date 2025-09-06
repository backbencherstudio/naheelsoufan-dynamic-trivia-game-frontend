
"use client";
import { SubscriptionAddForm } from '@/components/allForm/SubscriptionAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

function SubscriptionTypesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    subscriptionType: string;
    language: string;
    numberOfGames: string;
    numberOfQuestions: string;
    numberOfPlayers: string;
    price: string;
  } | null>(null);

  // Demo data matching the image
  const subscriptionTypesData = [
    { 
      no: 1, 
      typeName: "pilot", 
      price: "50", 
      players: "4", 
      games: "2", 
      languages: "English", 
      questions: "10", 
      actions: "Edit" 
    },
    { 
      no: 2, 
      typeName: "3 games", 
      price: "21", 
      players: "4", 
      games: "3", 
      languages: "English", 
      questions: "10", 
      actions: "Edit" 
    },
    { 
      no: 3, 
      typeName: "One Game", 
      price: "7.5", 
      players: "4", 
      games: "1", 
      languages: "English", 
      questions: "10", 
      actions: "Edit" 
    },
    { 
      no: 4, 
      typeName: "لعبة واحدة", 
      price: "$50", 
      players: "4", 
      games: "1", 
      languages: "عربي", 
      questions: "10", 
      actions: "Edit" 
    },
    { 
      no: 5, 
      typeName: "1 game 2players", 
      price: "20", 
      players: "2", 
      games: "1", 
      languages: "English", 
      questions: "3", 
      actions: "Edit" 
    },
  ];

  const columns = [
    {
      label: "No",
      accessor: "no",
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: "Type Name",
      accessor: "typeName",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Price",
      accessor: "price",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Players",
      accessor: "players",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Games",
      accessor: "games",
      width: "80px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Languages",
      accessor: "languages",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Questions",
      accessor: "questions",
      width: "90px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      width: "100px",
      formatter: (_: any, record: any) => {
        return (
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleEdit(record)}
              className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'
            >
              <FaPen />
            </button>
            <button 
              onClick={() => handleDelete(record)}
              className='text-xl cursor-pointer text-red-600 hover:text-red-800'
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        );
      },
    },
  ];

  // Search function
  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('subscriptionType');
    } else {
      params.set('subscriptionType', searchValue);
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

  const handleEdit = (record: any) => {
    console.log("Editing record:", record);
    setEditData({
      subscriptionType: record.typeName,
      language: record.language === "English" ? "english" : "arabic",
      numberOfGames: record.games,
      numberOfQuestions: record.questions,
      numberOfPlayers: record.players,
      price: record.price.replace('$', ''), // Remove $ symbol for form
    });
    setIsOpen(true);
  };

  const handleDelete = (record: any) => {
    console.log("Deleting record:", record);
  };

  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Types</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Subscription types</h2>
            <button 
              onClick={handleAddNew}
              className="bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer"
            >
              Create Subscription Type
            </button>
          </div>
          
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Select>
                <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='language'>Language</SelectItem>
                </SelectContent>
              </Select>
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
          data={subscriptionTypesData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
      {isOpen && <SubscriptionAddForm isOpen={isOpen} setIsOpen={setIsOpen} editData={editData} />}
    </div>
  );
}

export default SubscriptionTypesPage;
