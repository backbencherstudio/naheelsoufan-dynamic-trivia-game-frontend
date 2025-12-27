
"use client";
import { DifficultyAddForm } from '@/components/allForm/DificultAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import SearchComponent from '@/components/common/SearchComponent';
import { useDeleteDificultiesMutation, useGetDificultiesQuery } from '@/feature/api/apiSlice';
import useTranslation from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import {  useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function DifficultiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    id?: string;
    name: string;
    language: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const [difficultiesData, setDifficultiesData] = useState<any[]>([])
  const [totalData, setTotalData] = useState<any>(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { t } = useTranslation()

// 2. Build query params
const buildQueryParams = (searchValue = '') => {
  const params = new URLSearchParams();
  params.append('limit', itemsPerPage.toString());
  params.append('page', currentPage.toString());
  if (searchValue) params.append('q', searchValue);
  if (selectedLanguage) params.append('language_id', selectedLanguage);
  return params.toString();
};
const {data, isError, isLoading} = useGetDificultiesQuery({params: buildQueryParams(search || '') as any})
const [deleteDificulties] = useDeleteDificultiesMutation()
useEffect(() => {
  if(data){
    setDifficultiesData(data?.data || []);
    setTotalData(data?.pagination || {});
  }
}, [data]);


  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
      setCurrentPage(1);
    } else {
      setSearch(''); // Clear search if no URL parameter
    }
  }, [searchParams]);

  // Initialize selected language from URL params
  useEffect(() => {
    const languageParam = searchParams.get('language');
    setSelectedLanguage(languageParam || '');
  }, [searchParams]);

  const columns = [
    {
      label: t("no"),
      accessor: "no",
      width: "80px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: t("difficulty_level"),
      accessor: "name",
      width: "200px",
      formatter: (value: any) => {
        const display = typeof value === 'object' && value !== null ? (value.name ?? '') : (value ?? '');
        return <span className="text-sm font-medium">{String(display)}</span>;
      },
    },
    {
      label: t("language"),
      accessor: "language",
      width: "120px",
      formatter: (value: any) => {
        const display = typeof value === 'object' && value !== null ? (value.name ?? '') : (value ?? '');
        return <span className="text-sm">{String(display)}</span>;
      },
    },
    {
      label: t("point"),
      accessor: "points",
      width: "120px",
      formatter: (value: any) => {

        return <span className="text-sm">{value || 0}</span>;
      },
    },
    {
      label: t("No_of_questions"),
      accessor: "questions_count",
      width: "120px",
      formatter: (value: number) => (
        <span className="text-sm text-center">{value}</span>
      ),
    },
    {
      label: t("actions"),
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
      const response = await deleteDificulties({id: id});

      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(t("failed_to_delete_difficulty"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("difficulties")}</h1>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6 dark:bg-blackColor   p-2 md:p-0 md:pb-6 ">
        <div className="md:p-5 ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">{t("difficulties")}</h2>
            <button
              onClick={handleAddNew}
              className="bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer dark:bg-whiteColor/20 dark:text-whiteColor"
            >
              {t("add_new_difficulty")}
            </button>
          </div>

          <SearchComponent placeholder={t("search_difficulties_type")} />
        </div>
        {
          isError ? <p className='text-center text-red-500'>{t("something_went_wrong")}</p> :
          <DynamicTableTwo
            columns={columns}
            data={difficultiesData || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            paginationData={totalData}
            loading={isLoading}
          />
        }
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
