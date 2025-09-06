"use client"
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdEdit, MdFileDownload } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
function page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
   const [search, setSearch] = useState('');
   const searchParams = useSearchParams();
   const router = useRouter()
   const pathname = usePathname()
  const recentData = [
    { no: 1, language: 'عربي', actions: 'Edit' },
    { no: 2, language: 'English', actions: 'Edit' },
  ];

  const columns = [
    {
      label: "No",
      accessor: "no",
      width: "200px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    { label: 'Language', accessor: "language", width: '200px' },
    {
      accessor: 'actions', label: 'Actions', width: '200px',
      formatter: (value: any) => {
        return <div className="flex gap-2.5">
             <button className='text-2xl  cursor-pointer'><MdEdit /></button>
             <button className='text-2xl cursor-pointer text-primaryColor'><MdFileDownload /></button>
             <button className='text-xl cursor-pointer'><RiDeleteBin6Line color='red'/></button>
        </div>;
      },
    },
  ];

  // Search function
  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('language');
    } else {
      params.set('language', searchValue);
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
      <div>
        <h2 className='text-2xl font-semibold text-headerColor pb-4'>Language</h2>
      </div>
      <div className='border pb-4  rounded-md'>
        <div className='p-5'>
          <div className=' flex justify-between items-center mt-3 pb-6'>
            <h2 className='text-xl font-semibold text-headerColor pb-4'> Language</h2>
           <button className='bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer'>Add New Language </button>

          </div>
        <div className='flex gap-4'>
          <div>
            <Select>
               <SelectTrigger   className='w-[180px] !h-12.5 focus-visible:ring-0'>
                <SelectValue placeholder='All' />
               </SelectTrigger>
               <SelectContent>
                <SelectItem value='language'>Language</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className='relative w-full'>
          <input onChange={handleSearch} type="text" placeholder='Search' className='w-full border border-gray-300 rounded-md px-7 md:px-8 py-3' />
             <HiSearch className='absolute left-1.5 top-1/2 -translate-y-1/2 text-grayColor1 text-xl' />
          </div>
       
        </div>
        </div>
      <DynamicTableTwo
        columns={columns}
        data={recentData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemsPerPageOptions={[5, 10, 20]}
      />
      </div>
    </div>
  )
}

export default page
