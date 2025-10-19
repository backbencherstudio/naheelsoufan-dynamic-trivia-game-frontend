"use client";
import { TopicAddForm } from '@/components/allForm/TopicAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
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
  const { t } = useTranslation()
  // API endpoint with language filtering
  const endpoint = `/admin/categories?page=${currentPage}&limit=${itemsPerPage}&q=${search}${selectedLanguage ? `&language_id=${selectedLanguage}` : ''}`;

  // Debounced API call function
  const debouncedFetchData = useDebounce(async (url: string) => {
    try {
      setLoading(true);
      const response = await UserService.getData(url, token);
      setTopicsData(response.data?.data);

      console.log(response.data?.data)

      setPaginationData(response.data?.pagination);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, 500);

  console.log("data", topicsData[0]?.image)


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
      toast.error(t("failed_to_delete_topic"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setIsOpen(true);
  };

  const columns = [
    {
      label: t("no"),
      accessor: "no",
      width: "100px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: t("topic_name"),
      accessor: "name",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("language"),
      accessor: "language",
      width: "120px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("icon"),
      accessor: "image",
      width: "100px",
      formatter: (value: string, record) => {
        // If no image_url, show "No image"
        if (!record?.image_url) {
          return (
            <div className="w-[60px] h-[60px] bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          );
        }

        // Check if the image_url is a valid URL or relative path
        const isValidUrl = (
          record.image_url.startsWith('http://') ||
          record.image_url.startsWith('https://') ||
          record.image_url.startsWith('/') ||
          record.image_url.startsWith('./') ||
          record.image_url.startsWith('../')
        );

        // If it's not a valid URL, show "Local file"
        if (!isValidUrl) {
          return (
            <div className="flex items-center justify-center w-[60px] h-[60px] bg-gray-100 rounded">
              <span className="text-xs text-gray-500">Local file</span>
            </div>
          );
        }

        // Show the actual image
        return (
          <div className="flex items-center justify-center w-[60px]">
            <div className='w-[60px] h-[60px]'>
              <Image
                src={record.image_url}
                alt="icon"
                width={60}
                height={60}
                className="object-cover h-full w-full rounded"
              />
            </div>
          </div>
        );
      },
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

  const { data: questionExportData } = useDataFetch(`/admin/categories/export`);

  const handleExportQuestions = () => {
    try {
      // Prefer backend-provided export array if available
      const rawArray = Array.isArray(questionExportData?.data)
        ? questionExportData.data
        : Array.isArray(questionExportData)
          ? questionExportData
          : null;

      const payload = rawArray ?? topicsData ?? [];

      // Otherwise, map current table data to a similar structure.
      const fileContents = rawArray
        ? payload
        : payload.map((q: any) => ({
          text: q.name,
          category_id: q.category?.id ?? q.category,
          language_id: q.language?.id ?? q.language,
          points: q.points,
          answers: q.answers,
        }));

      const jsonString = JSON.stringify(fileContents, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `topic_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting questions:', error);
    }
  };

  const handleImportQuestions = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = async (e: any) => {
        const file: File | undefined = e?.target?.files?.[0];
        if (!file) return;
        try {
          // Read file to validate JSON quickly (optional)
          const text = await file.text();
          let parsed: any;
          try { parsed = JSON.parse(text); } catch { parsed = null; }

          // Send as FormData (backend can accept the uploaded JSON file)
          const formData = new FormData();
          const blob = new Blob([text], { type: 'application/json' });
          formData.append('file', blob, file.name || 'topics.json');

          const res = await UserService.addFormData('/admin/categories/import', formData, token);
          if (res?.data?.success) {
            toast.success(res?.data?.message || t("topics_imported_successfully"));
            // Refresh list
            if (endpoint && token) {
              debouncedFetchData(endpoint);
            }
          } else {
            toast.error(res?.data?.message || t("failed_to_import_topics"));
          }
        } catch (err: any) {
          console.error('Import error:', err);
          toast.error(err?.message || t("import_failed"));
        }
      };
      input.click();
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  };


  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("topic")}</h1>
        </div>
      </div>
      {/* Table Section */}
      <div className="border p-2 md:p-0 md:pb-6 rounded-lg pb-6">
        <div className="md:p-5 ">
          <div className="flex gap-2 flex-wrap justify-between items-center mb-6">
            <div className='flex items-center gap-2.5'>
              <MdCategory className='text-primaryColor' size={24} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">{t("topic")}</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportQuestions}
                className="bg-blue-600 text-white font-medium text-sm md:text-base rounded-md px-2 py-1 md:px-4 md:py-2 cursor-pointer hover:bg-blue-700">
                {t("export_topic")}
              </button>
              <button
                onClick={handleImportQuestions}
                className="bg-blue-800 text-white font-medium text-sm md:text-base rounded-md px-2 py-1 md:px-4 md:py-2 cursor-pointer hover:bg-blue-900">
                {t("import_topic")}
              </button>
              <button onClick={handleAddNew} className="flex cursor-pointer items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors">
                <FaPlus />
                {t("add_topic")}
              </button>
            </div>
          </div>

          {/* Filter and Search Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-3">
            <div className="md:!w-48 !w-full">
              <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
                <SelectTrigger className='md:!w-[180px] !w-full !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder={t("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t("language")}</SelectItem>
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
                placeholder={t("search_topics")}
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
