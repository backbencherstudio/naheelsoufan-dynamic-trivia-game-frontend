
"use client";
import { DifficultyAddForm } from '@/components/allForm/DificultAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

function DifficultiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    difficultyName: string;
    language: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
const [difficultiesData , setDifficultiesData] = useState<any[]>([])
const [totalData , setTotalData] = useState<any>(0)
  
const endpoint = `/admin/difficulties?page=${currentPage}&limit=${itemsPerPage}&q=${search}`
 const {data , loading}= useDataFetch(endpoint)
useEffect(() => {
  if (data?.data?.length > 0) {
    setDifficultiesData(data?.data)
  }
  if (data) {
    setTotalData(data?.pagination)
  }
}, [data])
  
  console.log("check",data);
  
 
 const columns = [
    {
      label: "No",
      accessor: "no",
      width: "80px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: "Question Type",
      accessor: "name",
      width: "200px",
      formatter: (value: any) => {
        const display = typeof value === 'object' && value !== null ? (value.name ?? '') : (value ?? '');
        return <span className="text-sm font-medium">{String(display)}</span>;
      },
    },
    {
      label: "Language",
      accessor: "language",
      width: "120px",
      formatter: (value: any) => {
        const display = typeof value === 'object' && value !== null ? (value.name ?? '') : (value ?? '');
        return <span className="text-sm">{String(display)}</span>;
      },
    },
    {
      label: "Actions",
      accessor: "actions",
      width: "120px",
      formatter: (_: any, record: any) => {
        return (
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleEdit(record)}
              className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'
            >
              <FaPen />
            </button>
            <button className='text-xl cursor-pointer text-red-600 hover:text-red-800'>
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
      params.delete('difficulty');
    } else {
      params.set('difficulty', searchValue);
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

  // Handle edit functionality
  const handleEdit = (record: any) => {
    setEditData(record)
   
    setIsOpen(true);
  };

  // Handle add new functionality
  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Difficulties</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6 dark:bg-blackColor    ">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">Difficulties</h2>
            <button 
              onClick={handleAddNew}
              className="bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer dark:bg-whiteColor/20 dark:text-whiteColor"
            >
              Add New Difficulty
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
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500" 
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
        
        <DynamicTableTwo
          columns={columns}
          data={difficultiesData || []}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={totalData}
          loading={loading}
        />
      </div>

      {/* Difficulty Add Form */}
      <DifficultyAddForm 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        editData={editData}
      />
    </div>
  );
}

export default DifficultiesPage;
