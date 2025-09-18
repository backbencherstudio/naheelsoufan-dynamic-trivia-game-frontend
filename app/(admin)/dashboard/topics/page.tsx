"use client";
import { TopicAddForm } from '@/components/allForm/TopicAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaPen, FaPlus } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { MdCategory } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function TopicsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [topicsData, setTopicsData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const { token } = useToken();

  // API endpoint with language filtering
  const endpoint = `/admin/categories?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}`;

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setTopicsData(response.data?.data);
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

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
    }
  }, [endpoint, token]);

  // Fetch language data for the dropdown
  const { data: languageData } = useDataFetch(`/admin/languages`);


  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language_id');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);
  const handleEdit = (record: any) => {
    setEditData(record);
    setIsOpen(true);
  };

  const handleDelete = async (id: any) => {
    setDeletingId(id);
    try {
      const response = await UserService.deleteData(`/admin/categories/${id}`, token);

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setTopicsData(prevData => prevData.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Failed to delete topic");
    } finally {
      setDeletingId(null);
    }
  };
  console.log("topicsData check",topicsData);
  

  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const columns = [
    {
      label: "No.",
      accessor: "no",
      width: "100px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: "Topic Name",
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
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Icon",
      accessor: "image_url",
      width: "100px",
      formatter: (value: string) => (
        <div className="flex items-center justify-center w-[60px]">
          {value ? <Image src={value} alt="icon" width={60} height={60} /> : ""}
        </div>
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
            <button
              onClick={() => handleEdit(record)}
              className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'
            >
              <FaPen />
            </button>
            <button
              onClick={() => handleDelete(record.id)}
              disabled={isDeleting}
              className='text-xl cursor-pointer text-red-600 hover:text-red-800 disabled:opacity-50'
            >
              {isDeleting ? <Loader2 className='animate-spin' /> : <RiDeleteBin6Line />}
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



  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Topics</h1>
        </div>
      </div>
      {/* Table Section */}
      <div className="border rounded-lg pb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className='flex items-center gap-2.5'>
              <MdCategory className='text-primaryColor' size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">Topics</h2>
            </div>
            <div className="flex gap-3">
              {/* <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border dark:text-whiteColor border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FiDownload className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border dark:text-whiteColor border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FiUpload className="w-4 h-4" />
                Import Data
              </button> */}
              <button onClick={handleAddNew} className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaPlus />
                Add Topic
              </button>
            </div>
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
                placeholder="Search topics..."
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <DynamicTableTwo
          columns={columns}
          data={topicsData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={paginationData}
          loading={loading}
        />
      </div>
      {isOpen && <TopicAddForm isOpen={isOpen} setIsOpen={setIsOpen} editData={editData} topicsData={topicsData} setTopicsData={setTopicsData} languageData={languageData} />}
    </div>
  );
}

export default TopicsPage;
