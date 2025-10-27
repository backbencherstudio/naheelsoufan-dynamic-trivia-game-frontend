"use client";
import { QuestionAddForm } from '@/components/allForm/QuestionTypeAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function QuestionTypesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Demo data matching the image
  const [questionData, setQuestionData] = useState<any[]>([])
  const [totalData, setTotalData] = useState<any>(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useToken()
 const [editData, setEditData] = useState<{} | null>({});
  const endpoint = `/admin/question-types?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}`

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setQuestionData(response.data?.data);
      setTotalData(response.data?.pagination);
    } catch (err) {
      setError(err.message || "Something went wrong");
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
      setSearch(''); // Clear search if no URL parameter
    }
  }, [searchParams]);

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
      setCurrentPage(1);
    }
  }, [endpoint, token]);

  // Fetch language data for the dropdown
  const { data: languageData } = useDataFetch(`/admin/languages`);



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
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Language",
      accessor: "language",
      width: "120px",
      formatter: (value: any) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      width: "120px",
      formatter: (_: any, record: any) => {
        const isDeleting = deletingId === record.id;
        return (
          <div className="flex gap-2.5">
            <button onClick={() => handleEdit(record)} className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'>
              <FaPen />
            </button>
            <button 
              onClick={() => handleDelete(record)} 
              disabled={isDeleting}
              className='text-xl cursor-pointer text-red-600 hover:text-red-800 disabled:opacity-50'
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <RiDeleteBin6Line />
              )}
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

  // Handle language selection
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value === 'all' ? '' : value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('language_id');
    } else {
      params.set('language_id', value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language_id');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

  

  const handleEdit = (record: any) => {
    setEditData(record);
    setIsOpen(true);
  };

  const handleDelete = async(record: any) => {
    setDeletingId(record.id);
    try {
      const response = await UserService.deleteData(`/admin/question-types/${record.id}`, token);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setQuestionData(questionData.filter((item) => item.id !== record.id));
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    } finally {
      setDeletingId(null);
    }
  };
 
  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };
  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Question types</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg  pb-6">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">Question types</h2>
            <button onClick={handleAddNew} className="bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer">
              Add New Type
            </button>
          </div>

        {/* Filter and Search Section */}
        <div className="flex gap-4 mb-6">
          <div className="w-48">
            <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
              <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                <SelectValue placeholder='Language' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {
                  languageData?.data?.map((item: any) => (
                    <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Search question types..."
              className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        </div>

        <DynamicTableTwo
          columns={columns}
          data={questionData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={totalData}
          loading={loading}
        />
      </div>
      {isOpen && <QuestionAddForm isOpen={isOpen} setIsOpen={setIsOpen} editData={editData} questionData={questionData} setQuestionData={setQuestionData} />}
    </div>
  );
}

export default QuestionTypesPage;

