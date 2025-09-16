"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import AddQuestionModal from '@/components/dashboard/AddQuestionModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('question');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    question: string;
    topic: string;
    difficulty: string;
    language: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useToken();
  
  const endpoint = `/admin/questions?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}&sort_by=${sortBy}&sort_order=${sortOrder}`;

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setQuestionData(response.data?.data);
      setPaginationData(response.data?.pagination);
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

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
    }
  }, [endpoint, token]);

  // Fetch language data for dropdown
  const { data: languageData } = useDataFetch(`/admin/languages`);


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
      label: "Question",
      accessor: "text",
      width: "250px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Topic",
      accessor: "category",
      width: "120px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Difficulty",
      accessor: "difficulty",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Language",
      accessor: "language",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Question Type",
      accessor: "question_type",
      width: "120px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Answer",
      accessor: "answers",
      width: "120px",
      formatter: (value: any) => {
        const ans = value?.find((item: any) => item.is_correct == true)
        return (
          <span className="text-sm">{ans?.text}</span>
        )
      },
    },
    {
      label: "Question Timer",
      accessor: "time",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Difficulty Points",
      accessor: "points",
      width: "130px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Free Bundle",
      accessor: "free_bundle",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value ? "Yes" : "No"}</span>
      ),
    },
    {
      label: "Firebase",
      accessor: "firebase",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value ? "Yes" : "No"}</span>
      ),
    },
    {
      label: "Options",
      accessor: "options",
      width: "100px",
      formatter: (_: any, record: any) => {
        const isDeleting = deletingId === record.id;
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

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

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
      params.delete('language');
    } else {
      params.set('language', value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Handle sort order toggle
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (record: any) => {
    console.log("Editing question:", record);
    setIsOpen(true)
    setEditData(record)
  };

  const handleDelete = async (value: any) => {
    setDeletingId(value.id);
    try {
      const response = await UserService.deleteData(`/admin/questions/${value?.id}`, token);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        const updatedData = questionData.filter(item => item?.id !== value?.id);
        setQuestionData(updatedData);
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportQuestions = () => {
    console.log("Exporting questions...");
  };

  const handleImportQuestions = () => {
    console.log("Importing questions...");
  };

  const handleAddNewQuestion = () => {
    console.log("Adding new question...");
    setIsOpen(true)
    setEditData(null)
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Questions</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportQuestions}
            className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700">
            Export Questions
          </button>
          <button
            onClick={handleImportQuestions}
            className="bg-blue-800 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-900">
            Import Questions
          </button>
          <button
            onClick={handleAddNewQuestion}
            className="bg-white text-gray-900 border border-gray-300 font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
            Add New Question
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg  pb-6">
        <div className="p-5">
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
            <div className="w-48 flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder='Sort by Question' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='question'>Sort by Question</SelectItem>
                  <SelectItem value='topic'>Sort by Topic</SelectItem>
                  <SelectItem value='difficulty'>Sort by Difficulty</SelectItem>
                  <SelectItem value='language'>Sort by Language</SelectItem>
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
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder="Search questions..."
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
          loading={loading}
          paginationData={paginationData}
        />
      </div>

      {isOpen && <AddQuestionModal isOpen={isOpen} onClose={() => setIsOpen(false)} editData={editData} questionData={questionData} setQuestionData={setQuestionData}/>}
    </div>
  );
}

export default QuestionsPage;
