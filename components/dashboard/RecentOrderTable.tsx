"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from "@/helper/debounce.helper";
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { SubscriptionType } from '@/types';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { SubscriptionAddForm } from '../allForm/SubscriptionAddForm';
import DynamicTableTwo from "../common/DynamicTableTwo";
function RecentOrderTable({ recentOrder }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<SubscriptionType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subscriptionTypesData, setSubscriptionTypesData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { token } = useToken();
  const endpoint = `/admin/subscription-types?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}`

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setSubscriptionTypesData(response.data?.data);
      setPaginationData(response.data?.pagination);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, 500);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const subscriptionTypeParam = searchParams.get('subscriptionType');
    if (subscriptionTypeParam) {
      setSearch(subscriptionTypeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (endpoint && token) {
      debouncedFetchData(endpoint);
    }
  }, [endpoint, token]);

  console.log(paginationData);
  
  const { data: languageData } = useDataFetch(`/admin/languages`);

  // Handle language selection
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value === 'all' ? '' : value);
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('language_id');
    } else {
      params.set('language_id', value);
    }
    router.replace(`${pathname}?${params.toString()}`,{scroll: false});
  };

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language_id');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

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
      accessor: "type",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Price",
      accessor: "price",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Players",
      accessor: "players",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Games",
      accessor: "games",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Languages",
      accessor: "language",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: "Questions",
      accessor: "questions",
      width: "90px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
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
      params.delete('subscriptionType');
    } else {
      params.set('subscriptionType', searchValue);
    }
    router.replace(`${pathname}?${params.toString()}`,{scroll: false});
  }, [searchParams, router, pathname]);

  // Debounced search function using the reusable hook
  const debouncedSearch = useDebounce(searchFunction, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setIsOpen(true);
  };

  const handleDelete = async (id: any) => {
    setDeletingId(id);
    try {
      const response = await UserService.deleteData(`/admin/subscription-types/${id}`, token);

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // Remove the deleted item from the local state
        setSubscriptionTypesData(prevData => prevData.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting difficulty:", error);
      toast.error("Failed to delete subscription type");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  return (
    <section>
      <div className="border p-5 rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">Subscription types</h1>
          <button
            onClick={handleAddNew}
            className="bg-grayColor1/50 dark:bg-whiteColor text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer"
          >
            Create Subscription Type
          </button>
        </div>
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
            <div className="relative flex-1">
              <input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder="Search subscription types..."
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
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
          paginationData={paginationData}
          loading={loading}
        />
      </div>
      {isOpen && 
      <SubscriptionAddForm 
      isOpen={isOpen}
      setIsOpen={setIsOpen} 
      editData={editData} 
      subscriptionTypesData={subscriptionTypesData} 
      setSubscriptionTypesData={setSubscriptionTypesData}  
      languageData={languageData}
      />}
    </section>
  );
}

export default RecentOrderTable;
