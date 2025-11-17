"use client";
import { useDeleteServiceTypeMutation, useGetServiceTypeQuery } from "@/feature/api/apiSlice";
import { useToken } from '@/hooks/useToken';
import useTranslation from "@/hooks/useTranslation";
import { UserService } from '@/service/user/user.service';
import { SubscriptionType } from '@/types';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPen } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { SubscriptionAddForm } from '../allForm/SubscriptionAddForm';
import DynamicTableTwo from "../common/DynamicTableTwo";
import SearchComponent from '../common/SearchComponent';
function RecentOrderTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<SubscriptionType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [subscriptionTypesData, setSubscriptionTypesData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const { token } = useToken();
  const { t } = useTranslation()
   const buildQueryParams = (searchValue = '') => {
  const params = new URLSearchParams();
  params.append('limit', itemsPerPage.toString());
  params.append('page', currentPage.toString());
  if (searchValue) params.append('q', searchValue);
  if (selectedLanguage) params.append('language_id', selectedLanguage);
  return params.toString();
};
  
const {data , isLoading} = useGetServiceTypeQuery({params: buildQueryParams(search)})
const [deleteServiceType] = useDeleteServiceTypeMutation()

useEffect(()=>{
 if(data){
  setSubscriptionTypesData(data?.data || [])
  setPaginationData(data?.pagination || {})
 }
},[data])

  // Get search parameter from URL on component mount
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
      width: "60px",
      formatter: (_: any, _row: any, index: number) => {
        const serial = index + 1;
        return <span className="text-sm font-medium">{serial}</span>;
      },
    },
    {
      label: t("Subscription Title"),
      accessor: "title",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("Subscription type"),
      accessor: "type",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("price"),
      accessor: "price",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("players"),
      accessor: "players",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("games"),
      accessor: "games",
      width: "80px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("languages"),
      accessor: "language",
      width: "100px",
      formatter: (value: { name: string }) => (
        <span className="text-sm">{value?.name}</span>
      ),
    },
    {
      label: t("questions"),
      accessor: "questions",
      width: "90px",
      formatter: (value: number) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("actions"),
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


  const handleEdit = (record: any) => {
    setEditData(record);
    setIsOpen(true);
  };

  const handleDelete = async (id: any) => {
    setDeletingId(id);
    try {
      const response = await deleteServiceType({id});

      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
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
      <div className="border p-2 md:p-5 rounded-md">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="md:text-2xl font-semibold text-gray-900 dark:text-whiteColor">{t("subscription_type")}</h1>
          <button
            onClick={handleAddNew}
            className="bg-grayColor1/50 dark:bg-whiteColor text-headerColor md:text-base text-sm font-medium rounded-md p-2 px-4 cursor-pointer"
          >
            {t("create_subscription_type")}
          </button>
        </div>
        <SearchComponent placeholder={t("search_subscription_type")} />
        <DynamicTableTwo
          columns={columns}
          data={subscriptionTypesData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          paginationData={paginationData}
          loading={isLoading}
        />
      </div>
      {isOpen &&
        <SubscriptionAddForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          editData={editData}
         
        />}
    </section>
  );
}

export default RecentOrderTable;
