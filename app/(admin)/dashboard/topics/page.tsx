"use client";
import { TopicAddForm } from '@/components/allForm/TopicAddForm';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { useDebounce } from '@/helper/debounce.helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from "react";
import { FaPen, FaPlus } from 'react-icons/fa6';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { MdCategory } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

function TopicsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{
    topicName: string;
    language: string;
    icon?: string;
  } | null>(null);
  // Demo data matching the image
  const topicsData = [
    { 
      no: 1, 
      topicName: "Cosmetics", 
      language: "English", 
      icon: "👤", 
      actions: "Edit" 
    },
    { 
      no: 2, 
      topicName: "دوري ابطال اوروبا", 
      language: "عربي", 
      icon: "⚽", 
      actions: "Edit" 
    },
    { 
      no: 3, 
      topicName: "Maps", 
      language: "English", 
      icon: "☁️", 
      actions: "Edit" 
    },
    { 
      no: 4, 
      topicName: "معلومات عامة", 
      language: "عربي", 
      icon: "🧠", 
      actions: "Edit" 
    },
    { 
      no: 5, 
      topicName: "Grocery", 
      language: "English", 
      icon: "🛒", 
      actions: "Edit" 
    },
    { 
      no: 6, 
      topicName: "إحزرها", 
      language: "عربي", 
      icon: "❓", 
      actions: "Edit" 
    },
    { 
      no: 7, 
      topicName: "Charades", 
      language: "English", 
      icon: "🎭", 
      actions: "Edit" 
    },
    { 
      no: 8, 
      topicName: "خرائط", 
      language: "عربي", 
      icon: "☁️", 
      actions: "Edit" 
    },
    { 
      no: 9, 
      topicName: "Geography", 
      language: "English", 
      icon: "🌍", 
      actions: "Edit" 
    },
    { 
      no: 10, 
      topicName: "Science", 
      language: "English", 
      icon: "🔬", 
      actions: "Edit" 
    },
  ];
  const handleEdit = (record: any) => {
    console.log("Editing record:", record);
    setEditData({
      topicName: record.topicName,
      language: record.language === "English" ? "english" : "arabic",
      icon: record.icon
    });
    setIsOpen(true);
  };

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
      accessor: "topicName",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Language",
      accessor: "language",
      width: "120px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Icon",
      accessor: "icon",
      width: "100px",
      formatter: (value: string) => (
        <div className="flex items-center   justify-center">
          <span className="text-2xl">{value}</span>
        </div>
      ),
    },
    {
      label: "Actions",
      accessor: "actions",
      width: "120px",
      formatter: (_: any, record: any) => {
        return (
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleEdit(record)}
              className='text-xl cursor-pointer text-grayColor1 hover:text-blue-600'
            >
              <FaPen />
            </button>
            <button className='text-xl cursor-pointer text-red-600 hover:text-red-800'>
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
      params.delete('topic');
    } else {
      params.set('topic', searchValue);
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

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
         
          <h1 className="text-2xl font-semibold text-gray-900">Topics</h1>
        </div>
        
       
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white pb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className='flex items-center gap-2.5'>
            <MdCategory className='text-primaryColor' size={24}/>
            <h2 className="text-xl font-semibold text-gray-900">Topics</h2>
            </div>
            <div className="flex gap-3">
          <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex cursor-pointer items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiUpload className="w-4 h-4" />
            Import Data
          </button>
           <button onClick={handleAddNew} className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
             <FaPlus/>
             Add Topic
           </button>
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
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
      {isOpen && <TopicAddForm isOpen={isOpen} setIsOpen={setIsOpen} editData={editData} />}
    </div>
  );
}

export default TopicsPage;
