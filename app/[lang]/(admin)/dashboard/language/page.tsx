"use client"
import { LanguageForm } from '@/components/allForm/LanguageForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdEdit, MdFileDownload } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useDeleteLanguagesMutation, useGetLanguagesQuery } from '@/feature/api/apiSlice';
function page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [languageData, setLanguageData] = useState([]);
  const [totalData, setTotalData] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter()
  const pathname = usePathname()
  const [editData, setEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation()
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const buildQueryParams = (searchValue = '') => {
    const params = new URLSearchParams();
    params.append('limit', itemsPerPage.toString());
    params.append('page', currentPage.toString());
    if (searchValue) params.append('q', searchValue);
    return params.toString();
  } 
 const [deleteLanguages, ] = useDeleteLanguagesMutation()
  const { data: languageDataList, isLoading: languageLoading } = useGetLanguagesQuery({params: buildQueryParams(search || '') as any});
  useEffect(() => {
    if (languageDataList) {
      setLanguageData(languageDataList?.data || []);
      setTotalData(languageDataList?.pagination || {});
    }
  }, [languageDataList]);


  const columns = [
    {
      label: t("no"),
      accessor: "no",
      width: "200px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    { label: t("language"), accessor: "name", width: '200px' },
    {
      accessor: 'actions', label: t("actions"), width: '200px',
      formatter: (_, value: any) => {
        const isDeleting = deletingId === value.id;
        return <div className="flex gap-2.5">
          <button onClick={() => handleEdit(value)} className='text-2xl  cursor-pointer'><MdEdit /></button>
          <button onClick={() => handleDownload(value)} className='text-2xl cursor-pointer text-primaryColor'><MdFileDownload /></button>
          <button
            onClick={() => handleDelete(value)}
            disabled={isDeleting}
            className='text-xl cursor-pointer disabled:opacity-50'
          >
            {isDeleting ? <Loader2 className='animate-spin' /> : <RiDeleteBin6Line color={'red'} />}
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
  const handleDownload = async (value: any) => {
    try {
      if (!value?.file_url) {
        toast.error(t("no_file_available_for_download"));
        return;
      }

      // Fetch the file content directly
      const response = await fetch(value.file_url);
      if (!response.ok) {
        throw new Error(t("failed_to_fetch_file"));
      }

      const blob = await response.blob();

      // Create a blob URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${value.name || t("language")}_file.json`;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      toast.success(t("file_downloaded_successfully"));
    } catch (error) {
      console.error('Download error:', error);
      toast.error(t("failed_to_download_file"));
    }
  }
  const handleEdit = (value: any) => {
    setEditData(value);
    setIsOpen(true);
  }
  const handleDelete = async (value: any) => {
    setDeletingId(value.id);
    try {
        const response = await deleteLanguages({id: value?.id});
      if (response?.data?.success) {
        toast.success(response?.data?.message)
      }
    } catch (error) {
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
        <h2 className='text-2xl font-semibold text-headerColor dark:text-whiteColor pb-4'>{t("language")}</h2>
      </div>
      <div className='border pb-6 md:pb-6  p-2 md:p-0 rounded-md'>
        <div className='md:p-5 pb-4 '>
          <div className=' flex justify-between items-center mt-3 pb-6'>
            <h2 className='text-xl font-semibold text-headerColor dark:text-whiteColor pb-4'> {t("language")}</h2>
            <button onClick={handleAddNew} className='bg-grayColor1/50 text-headerColor font-medium rounded-md p-2 px-4 cursor-pointer dark:bg-whiteColor dark:text-blackColor'>{t("add_new_language")}</button>

          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div>
              <Select>
                <SelectTrigger className='md:!w-[180px] !w-full !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder={t("all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='language'>{t("language")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='relative w-full'>
              <input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder={t("search_language_type")}
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
          loading={languageLoading}
        />
      </div>

      {isOpen && <LanguageForm isOpen={isOpen} setIsOpen={setIsOpen} data={editData} />}
    </div>
  )
}

export default page
