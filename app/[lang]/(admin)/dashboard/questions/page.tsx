"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import AddQuestionModal from '@/components/dashboard/AddQuestionModal';
import QuestionViewDetails from '@/components/dashboard/QuestionViewDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddQuestionImportMutation, useDeleteQuestionMutation, useGetLanguagesQuery, useGetQuestionExportQuery, useGetQuestionQuery } from '@/feature/api/apiSlice';
import useDely from '@/hooks/useDely';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { IoEyeSharp } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isOpen, setIsOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
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

  // map UI sort keys to API sort keys
  const mapSortKey = (key: string) => {
    if (key === 'topic') return 'category';
    if (key === 'difficulty') return 'difficulty';
    if (key === 'language') return 'language';
    return '';
  };
  const debouncedSearch = useDely(search, 500);
  const apiSortKey = mapSortKey(sortBy);
  const buildQueryParams = (searchValue = '') => {
    const params = new URLSearchParams();
    params.append('limit', itemsPerPage.toString());
    params.append('page', currentPage.toString());
    if (searchValue) params.append('q', searchValue);
    if (apiSortKey) params.append('sort', apiSortKey);
    if (sortOrder) params.append('order', sortOrder);
    if (selectedLanguage) params.append('language_id', selectedLanguage);
    return params.toString();
  };

  const { data, isLoading, isError } = useGetQuestionQuery({ params: buildQueryParams(debouncedSearch) })
  const [AddQuestionImport] = useAddQuestionImportMutation()
  const [DeleteQuestion] = useDeleteQuestionMutation()
  const { t } = useTranslation()
  // Debounced API call function
  useEffect(() => {
    if (data) {
      setQuestionData(data?.data)
      setPaginationData(data?.pagination)
    }
  }, [data])

  // Get search parameter from URL on component mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order') as 'asc' | 'desc' | null;
    if (sortParam) {
      // reverse map for UI
      const uiKey = sortParam === 'category' ? 'topic' : sortParam;
      if (uiKey !== sortBy) setSortBy(uiKey);
    }
    if ((orderParam === 'asc' || orderParam === 'desc') && orderParam !== sortOrder) {
      setSortOrder(orderParam);
    }
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

  // Fetch language data for dropdown
  const { data: languageData } = useGetLanguagesQuery({ params: `limit=1000&page=1` });

  const detectMediaKind = (src: string, file?: File | null): 'image' | 'audio' | 'video' => {
    if (file && file.type) {
      if (file.type.startsWith('image')) return 'image';
      if (file.type.startsWith('audio')) return 'audio';
      if (file.type.startsWith('video')) return 'video';
    }
    const lower = src?.toLowerCase();
    if (/(mp4|webm|ogg|mov|m4v)$/.test(lower)) return 'video';
    if (/(mp3|wav|ogg|m4a)$/.test(lower)) return 'audio';
    return 'image';
  };

  const columns = [
    {
      label: t("no"),
      accessor: "no",
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: t("question"),
      accessor: "text",
      width: "250px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("topic"),
      accessor: "category",
      width: "120px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("difficulty"),
      accessor: "difficulty",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("language"),
      accessor: "language",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("question_type"),
      accessor: "question_type",
      width: "120px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("answer"),
      accessor: "answers",
      width: "120px",
      formatter: (value: any) => {
        const ans = value?.find((item: any) => item.is_correct == true)
        console.log("check answer",value);
        
        return (
          <span className="text-sm">{ans?.text}</span>
        )
      },
    },
    {
      label: t("question_timer"),
      accessor: "time",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("difficulty_points"),
      accessor: "points",
      width: "130px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("free_bundle"),
      accessor: "free_bundle",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value ? "Yes" : "No"}</span>
      ),
    },
    {
      label: "Media",
      accessor: "question_file_url",
      width: "120px",
      formatter: (src: string) => {
        const kind = detectMediaKind(src, typeof src !== 'string' ? (src as File | null) : null);
        return (
          <div>
            {
              src == null || src== "" ? <span className="text-sm border rounded-sm bg-grayColor1/60 w-full h-17 flex items-center justify-center text-gray-500">No Image</span> :
               <div className=" rounded-md ">
              {kind === 'image' && (
                <Image src={src} alt="preview" width={100} height={100} className=" h-[60px] w-auto object-contain" />
              )}
              {kind === 'audio' && (
                <div className="relative">
                  {src.startsWith('blob:') ? (
                    // Local preview audio (blob URL)
                    <audio controls src={src} className="w-full" />
                  ) : (
                    // Server audio with CORS handling
                    <div className="relative">
                      <audio
                        controls
                        className="w-full"
                        preload="none"
                        crossOrigin="anonymous"
                        onLoadStart={() => console.log('Audio loading started for:', src)}
                        onCanPlay={() => console.log('Audio can play:', src)}
                        onLoadedData={() => console.log('Audio data loaded:', src)}
                        onError={(e) => {
                          // Try without CORS
                          if (e.currentTarget.crossOrigin) {
                            console.log('Retrying audio without CORS...');
                            e.currentTarget.crossOrigin = null;
                            e.currentTarget.load();
                          }
                        }}
                      >
                        <source src={src} type="audio/mpeg" />
                        <source src={src} type="audio/wav" />
                        <source src={src} type="audio/ogg" />
                        Your browser does not support the audio element.
                      </audio>


                    </div>
                  )}
                </div>
              )}
              {kind === 'video' && (
                <div className="relative">
                  {src.startsWith('blob:') ? (
                    // Local preview video (blob URL)
                    <video
                      controls
                      src={src}
                      className="h-17 w-auto object-contain rounded-lg "
                      width={200}
                      height={100}
                      preload="metadata"
                      playsInline
                      muted
                      style={{ maxWidth: '100%', maxHeight: '68px' }}
                    />
                  ) : (
                    // Server video with CORS handling
                    <div className="relative">
                      <video
                        controls
                        className="h-17 w-auto object-contain rounded-lg  bg-gray-100"
                        width={200}
                        height={100}
                        preload="none"
                        playsInline
                        crossOrigin="anonymous"
                        onLoadStart={() => console.log('Video loading started for:', src)}
                        onCanPlay={() => console.log('Video can play:', src)}
                        onLoadedData={() => console.log('Video data loaded:', src)}
                        onLoadedMetadata={() => console.log('Video metadata loaded:', src)}
                        onError={(e) => {

                          // Try without CORS
                          if (e.currentTarget.crossOrigin) {
                            console.log('Retrying without CORS...');
                            e.currentTarget.crossOrigin = null;
                            e.currentTarget.load();
                          }
                        }}
                        style={{ maxWidth: '100%', maxHeight: '68px' }}
                      >
                        <source src={src} type="video/mp4" />
                        <source src={src} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}
            </div>
            }
           
          </div>
        )
      },
    },
    {
      label: t("options"),
      accessor: "options",
      width: "100px",
      formatter: (_: any, record: any) => {
        const isDeleting = deletingId === record.id;
        return (
          <div className="flex gap-2.5">

            <button
              onClick={() => handleView(record)}
              className='text-2xl cursor-pointer text-blueColor hover:text-blue-600'
            >
              <IoEyeSharp />
            </button>
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


  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('search');
    } else {
      params.set('search', searchValue);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  useEffect(() => {
    searchFunction(debouncedSearch);
  }, [debouncedSearch, searchFunction]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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

  // Sync URL when sortBy changes via dropdown (single source of truth - debounced effect will refetch)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (mapSortKey(sortBy)) {
      params.set('sort', mapSortKey(sortBy));
      params.set('order', sortOrder);
    } else {
      params.delete('sort');
      params.delete('order');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Handle sort order toggle and sync URL (debounced effect will refetch)
  const handleSortOrderToggle = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(nextOrder);
    const params = new URLSearchParams(searchParams);
    if (mapSortKey(sortBy)) {
      params.set('sort', mapSortKey(sortBy));
      params.set('order', nextOrder);
    } else {
      params.delete('sort');
      params.delete('order');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleEdit = (record: any) => {
    console.log("Editing question:", record);
    setIsOpen(true)
    setEditData(record)
  };
  const handleView = (record: any) => {
    console.log("Editing question:", record);
    setIsViewOpen(true)
    setEditData(record)
  };

  const handleDelete = async (value: any) => {
    setDeletingId(value.id);
    try {
      const response = await DeleteQuestion({ id: value?.id });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setDeletingId(null);
    }
  };
  const { data: questionExportData } = useGetQuestionExportQuery({});

  const handleExportQuestions = () => {
    try {
      // Prefer backend-provided export array if available
      const rawArray = Array.isArray(questionExportData?.data)
        ? questionExportData.data
        : Array.isArray(questionExportData)
          ? questionExportData
          : null;

      const payload = rawArray ?? questionData ?? [];

      // Otherwise, map current table data to a similar structure.
      const fileContents = rawArray
        ? payload
        : payload.map((q: any) => ({
          text: q.question,
          category_id: q.topic?.id ?? q.topic,
          language_id: q.language?.id ?? q.language,
          difficulty_id: q.difficulty?.id ?? q.difficulty,
          question_type_id: q.questionType?.id ?? q.questionType,
          points: q.points,
          answers: q.answers,
        }));

      const jsonString = JSON.stringify(fileContents, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `questions_export_${new Date().toISOString().split('T')[0]}.json`;
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
          formData.append('file', blob, file.name || 'questions.json');

          const res = await AddQuestionImport({ data: formData });
          if (res?.data?.success) {
            toast.success(res?.data?.message || 'Questions imported successfully');

          } else {
            toast.error(res?.data?.message || 'Failed to import questions');
          }
        } catch (err: any) {
          console.error('Import error:', err);
          toast.error(err?.message || 'Import failed');
        }
      };
      input.click();
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  };

  const handleAddNewQuestion = () => {
    setIsOpen(true)
    setEditData(null)
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between flex-wrap gap-3  items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("questions")}</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportQuestions}
            className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700">
            {t("export_question")}
          </button>
          <button
            onClick={handleImportQuestions}
            className="bg-blue-800 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-900">
            {t("import_question")}
          </button>
          <button
            onClick={handleAddNewQuestion}
            className="bg-white text-gray-900 border border-gray-300 font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50">
            {t("add_new_question")}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border p-2 md:p-0 rounded-lg md:pb-6 pb-6">
        <div className="md:p-5">
          {/* Filter and Search Section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="md:w-48 w-34">
              <Select value={selectedLanguage || 'all'} onValueChange={handleLanguageChange}>
                <SelectTrigger className='md:w-[180px] w-full  !h-12.5 focus-visible:ring-0'>
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
            <div className="md:w-48 w-42 flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='md:w-[180px] w-full !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder={t("sort_by")} />
                </SelectTrigger>
                <SelectContent>

                  <SelectItem value='topic'>{t("sort_topic")}</SelectItem>
                  <SelectItem value='difficulty'>{t("sort_difficulty")}</SelectItem>
                  <SelectItem value='language'>{t("sort_language")}</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => handleSortOrderToggle()}
                className="p-2 hover:bg-gray-100 rounded-md bg-blue-100"
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
                placeholder={t("search_question_placeholder")}
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
          loading={isLoading}
          paginationData={paginationData}
        />
      </div>

      {isOpen && <AddQuestionModal isOpen={isOpen} onClose={() => setIsOpen(false)} editData={editData} />}
        {isViewOpen && <QuestionViewDetails isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} editData={editData} />}
    </div>
  );
}

export default QuestionsPage;
