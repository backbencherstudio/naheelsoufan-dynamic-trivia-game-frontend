"use client";
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import AddQuestionModal from '@/components/dashboard/AddQuestionModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { HiSearch } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [questionFilter, setQuestionFilter] = useState('all');
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

  // Demo data matching the image
  const questionsData = [
    { 
      no: 1, 
      question: "Biofilter technology is used to process", 
      topic: "Technology", 
      difficulty: "Hard", 
      language: "English", 
      questionType: "Options", 
      answer: "Water", 
      questionTimer: "30", 
      difficultyPoints: "600", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 2, 
      question: "Ctrl+A does what?", 
      topic: "Technology", 
      difficulty: "Medium", 
      language: "English", 
      questionType: "Options", 
      answer: "Cuba", 
      questionTimer: "60", 
      difficultyPoints: "400", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 3, 
      question: "What's the capital of Japan?", 
      topic: "Capitals", 
      difficulty: "Easy", 
      language: "English", 
      questionType: "Options", 
      answer: "Select All", 
      questionTimer: "30", 
      difficultyPoints: "200", 
      freeBundle: "Yes", 
      firebase: "Yes" 
    },
    { 
      no: 4, 
      question: "في أي مدينة اوروبية تقع السلالم الإسبانية؟", 
      topic: "معلومات عامة", 
      difficulty: "متوسط", 
      language: "Arabic", 
      questionType: "Text", 
      answer: "Apricot", 
      questionTimer: "60", 
      difficultyPoints: "400", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 5, 
      question: "'I'm lovin' it' is the slogan of", 
      topic: "Brands", 
      difficulty: "Easy", 
      language: "English", 
      questionType: "Options", 
      answer: "Gitega", 
      questionTimer: "30", 
      difficultyPoints: "200", 
      freeBundle: "Yes", 
      firebase: "Yes" 
    },
    { 
      no: 6, 
      question: "What is the capital of Burundi?", 
      topic: "Capitals", 
      difficulty: "Medium", 
      language: "English", 
      questionType: "Options", 
      answer: "Tokyo", 
      questionTimer: "60", 
      difficultyPoints: "400", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 7, 
      question: "Which European city is home to the Spanish Steps?", 
      topic: "History", 
      difficulty: "Hard", 
      language: "English", 
      questionType: "Options", 
      answer: "روما", 
      questionTimer: "30", 
      difficultyPoints: "600", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 8, 
      question: "What is the slogan of McDonald's?", 
      topic: "Brands", 
      difficulty: "Easy", 
      language: "English", 
      questionType: "Options", 
      answer: "McDonald's", 
      questionTimer: "30", 
      difficultyPoints: "200", 
      freeBundle: "Yes", 
      firebase: "Yes" 
    },
    { 
      no: 9, 
      question: "Which fruit is known as the 'golden apple'?", 
      topic: "General Knowledge", 
      difficulty: "Medium", 
      language: "English", 
      questionType: "Options", 
      answer: "Apricot", 
      questionTimer: "60", 
      difficultyPoints: "400", 
      freeBundle: "No", 
      firebase: "Yes" 
    },
    { 
      no: 10, 
      question: "What is the largest planet in our solar system?", 
      topic: "Science", 
      difficulty: "Easy", 
      language: "English", 
      questionType: "Options", 
      answer: "Jupiter", 
      questionTimer: "30", 
      difficultyPoints: "200", 
      freeBundle: "Yes", 
      firebase: "Yes" 
    },
  ];

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
      accessor: "question",
      width: "250px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Topic",
      accessor: "topic",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Difficulty",
      accessor: "difficulty",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Language",
      accessor: "language",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Question Type",
      accessor: "questionType",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Answer",
      accessor: "answer",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Question Timer",
      accessor: "questionTimer",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Difficulty Points",
      accessor: "difficultyPoints",
      width: "130px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Free Bundle",
      accessor: "freeBundle",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Firebase",
      accessor: "firebase",
      width: "100px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Options",
      accessor: "options",
      width: "100px",
      formatter: (_: any, record: any) => {
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
              className='text-xl cursor-pointer text-red-600 hover:text-red-800'
            >
              <RiDeleteBin6Line />
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
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  // Debounced search function using the reusable hook
  const debouncedSearch = useDebounce(searchFunction, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleEdit = (record: any) => {
    console.log("Editing question:", record);
    setIsOpen(true)
    setEditData(record)
  };

  const handleDelete = (record: any) => {
    console.log("Deleting question:", record);
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
        <h1 className="text-2xl font-semibold text-gray-900">Questions</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleExportQuestions}
            className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700"
          >
            Export Questions
          </button>
          <button 
            onClick={handleImportQuestions}
            className="bg-blue-800 text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-900"
          >
            Import Questions
          </button>
          <button 
            onClick={handleAddNewQuestion}
            className="bg-white text-gray-900 border border-gray-300 font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50"
          >
            Add New Question
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6">
        <div className="p-5">
          {/* Filter and Search Section */}
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Select value={questionFilter} onValueChange={setQuestionFilter}>
                <SelectTrigger className='w-[180px] !h-12.5 focus-visible:ring-0'>
                  <SelectValue placeholder='Question' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='technology'>Technology</SelectItem>
                  <SelectItem value='capitals'>Capitals</SelectItem>
                  <SelectItem value='brands'>Brands</SelectItem>
                  <SelectItem value='history'>History</SelectItem>
                  <SelectItem value='science'>Science</SelectItem>
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
                  <SelectItem value='points'>Sort by Points</SelectItem>
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
                onChange={handleSearch}
                type="text" 
                placeholder="Search" 
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
        
        <DynamicTableTwo
          columns={columns}
          data={questionsData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>

      {isOpen && <AddQuestionModal isOpen={isOpen} onClose={() => setIsOpen(false)} editData={editData} />}
    </div>
  );
}

export default QuestionsPage;
