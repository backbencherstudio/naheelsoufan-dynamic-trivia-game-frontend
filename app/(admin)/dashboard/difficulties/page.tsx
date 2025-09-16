
"use client";
import { DifficultyAddForm } from '@/components/allForm/DificultAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import SearchComponent from '@/components/common/SearchComponent';
import { useDebounce } from '@/helper/debounce.helper';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function DifficultiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    id?: string;
    name: string;
    language: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [difficultiesData, setDifficultiesData] = useState<any[]>([])
  const [totalData, setTotalData] = useState<any>(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {token} = useToken()
  
  const endpoint = `/admin/difficulties?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}`

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setDifficultiesData(response.data?.data);
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
      label: "Points",
      accessor: "points",
      width: "120px",
      formatter: (value: any) => {
        
        return <span className="text-sm">{value || 0}</span>;
      },
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

  // Handle delete functionality
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await UserService.deleteData(`/admin/difficulties/${id}`, token);
      
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // Remove the deleted item from the local state
        setDifficultiesData(prevData => prevData.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting difficulty:", error);
      toast.error("Failed to delete difficulty");
    } finally {
      setDeletingId(null);
    }
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
          
          <SearchComponent placeholder="Search difficulties..."/>
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
        difficultiesData={difficultiesData}
        setDifficultiesData={setDifficultiesData}
      />
    </div>
  );
}

export default DifficultiesPage;
