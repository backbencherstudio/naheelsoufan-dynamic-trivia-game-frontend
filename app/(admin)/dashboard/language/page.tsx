"use client"
import { LanguageForm } from '@/components/allForm/LanguageForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdEdit, MdFileDownload } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
function page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
   const [search, setSearch] = useState('');
   const [languageData, setLanguageData] = useState([]);
   const [totalData, setTotalData] = useState({});
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const searchParams = useSearchParams();
   const router = useRouter()
   const pathname = usePathname()
   const [editData, setEditData] = useState(null);
     const [isOpen, setIsOpen] = useState(false);
     const [deletingId, setDeletingId] = useState<string | null>(null);
     const {token} = useToken();
     const endpoint = `/admin/languages?page=${currentPage}&limit=${itemsPerPage}&q=${search}`

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setLanguageData(response.data?.data);
      setTotalData(response.data?.pagination);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, 500);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const languageParam = searchParams.get('language');
    if (languageParam) {
      setSearch(languageParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
    }
  }, [endpoint, token]);


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
    { label: 'Language', accessor: "name", width: '200px' },
    {
      accessor: 'actions', label: 'Actions', width: '200px',
      formatter: (_,value: any) => {
        const isDeleting = deletingId === value.id;
        return <div className="flex gap-2.5">
             <button onClick={()=>handleEdit(value)} className='text-2xl  cursor-pointer'><MdEdit /></button>
             <button onClick={()=>handleDownload(value)} className='text-2xl cursor-pointer text-primaryColor'><MdFileDownload /></button>
             <button 
               onClick={()=>handleDelete(value)}  
               disabled={isDeleting}
               className='text-xl cursor-pointer disabled:opacity-50'
             >
               {isDeleting ? <Loader2 className='animate-spin' /> : <RiDeleteBin6Line color={'red'}/>}
             </button>
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
  const handleDownload = (value: any) => {
    console.log(value);
  }
  const handleEdit = (value: any) => {
    setEditData(value);
    setIsOpen(true);
  }
  const handleDelete = async(value: any) => {
    setDeletingId(value.id);
    try {
      const response = await UserService.deleteData(`/admin/languages/${value?.id}`, token);
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        const updatedData = languageData.filter(item => item?.id !== value?.id);
        setLanguageData(updatedData)
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message)
    } finally {
      setDeletingId(null);
    }
  }
  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  }
  return (
    <div>
      <div>
        <h2 className='text-2xl font-semibold text-headerColor dark:text-whiteColor pb-4'>Language</h2>
      </div>
      <div className='border pb-4  rounded-md'>
        <div className='p-5'>
          <div className=' flex justify-between items-center mt-3 pb-6'>
            <h2 className='text-xl font-semibold text-headerColor dark:text-whiteColor pb-4'> Language</h2>
           <button onClick={handleAddNew} className='bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer dark:bg-whiteColor dark:text-blackColor'>Add New Language </button>

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
          <input 
            value={search}
            onChange={handleSearch} 
            type="text" 
            placeholder='Search languages...' 
            className='w-full border border-gray-300 rounded-md px-7 md:px-8 py-3 dark:border-gray-700 dark:text-whiteColor focus:outline-none focus:ring-2 focus:ring-blue-500' 
          />
             <HiSearch className='absolute left-1.5 top-1/2 -translate-y-1/2 text-grayColor1 text-xl' />
          </div>
       
        </div>
        </div>
      <DynamicTableTwo
        columns={columns}
        data={languageData}
       currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={totalData}
          loading={loading}
      />
      </div>

      {isOpen && <LanguageForm isOpen={isOpen} setIsOpen={setIsOpen} data={editData} languageData={languageData} setLanguageData={setLanguageData} />}
    </div>
  )
}

export default page
