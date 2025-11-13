
"use client";
import { AddNewAdminForm } from '@/components/allForm/AddNewAdminForm';
import { AdminResetPasswordForm } from '@/components/allForm/AdminResetPassword';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { useDeleteAdminMutation, useGetAdminQuery } from '@/feature/api/apiSlice';
import useDely from '@/hooks/useDely';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import { UserService } from '@/service/user/user.service';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { HiSearch } from 'react-icons/hi';
import { HiShieldCheck } from 'react-icons/hi2';
import { RiDeleteBin6Line, RiRotateLockLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
function AdminManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [adminsData, setAdminsData] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const { token } = useToken();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
 const debouncedSearch = useDely(search, 500);

 const buildQueryParams = (searchValue = '') => {
  const params = new URLSearchParams();
  params.append('limit', itemsPerPage.toString());
  params.append('page', currentPage.toString());
  if (searchValue) params.append('q', searchValue);
  return params.toString();
};

 const {data, isError,isLoading}=useGetAdminQuery({params: buildQueryParams(debouncedSearch)})
 const [deleteAdmin] = useDeleteAdminMutation()
 useEffect(() => {
    if (data) {
       setAdminsData(data?.data)
       setPaginationData(data?.pagination)
    }
  }, [data]);
  // Get search parameter from URL on component mount
  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam) {
      setSearch(adminParam);
      setCurrentPage(1);
    }
  }, [searchParams]);

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
      label: t("name"),
      accessor: "name",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: t("email"),
      accessor: "email",
      width: "250px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: t("created"),
      accessor: "created_at",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm">{dayjs(value).format("MMMM DD, YYYY")}</span>
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
              className='text-xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-whiteColor dark:hover:text-blue-800'
            >
              <RiRotateLockLine size={24} />
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

  const handleEdit = (record: any) => {
    console.log("Resetting password for admin:", record);
    setSelectedAdmin({
      id: record.id,
      name: record.name,
      email: record.email
    });
    setIsResetPasswordOpen(true);
  };

  const handleDelete = async (record: any) => {
    setDeletingId(record.id);
    try {
      const response = await deleteAdmin({id:record?.id});
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddAdmin = () => {
    setIsAddAdminOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="md:flex justify-between w-full items-center mb-6">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center dark:bg-whiteColor dark:text-blackColor ">
            <HiShieldCheck className="md:w-5 md:h-5 text-white" />
          </div>
          <h1 className="md:text-2xl text-xl font-semibold text-gray-900 dark:text-whiteColor">{t("admin_management")}</h1>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={handleAddAdmin}
            className="bg-blue-600  text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 flex items-center gap-2 dark:bg-whiteColor dark:text-blackColor"
          >
            <span className="text-lg">+</span>
            {t("add_admin")}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border p-2 md:p-0 rounded-lg md:pb-6 pb-6">
        <div className="">
          {/* Search Section */}
          <div className="flex justify-between gap-4 items-center mb-2 md:p-5">
            <h2 className="text-xl text-nowrap font-semibold text-gray-900 dark:text-whiteColor">{t("admin_list")}</h2>
            <div className="relative w-64">
              <input
                value={search}
                onChange={handleSearch}
                type="text"
                placeholder={t("search_admin")}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:focus:ring-blue-500"
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <DynamicTableTwo
            columns={columns}
            data={adminsData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            paginationData={paginationData}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <AdminResetPasswordForm
          adminsData={adminsData}
          isOpen={isResetPasswordOpen}
          setIsOpen={setIsResetPasswordOpen}
          adminData={selectedAdmin}
        />
      )}

      {/* Add New Admin Modal */}
      {isAddAdminOpen && (
        <AddNewAdminForm
          isOpen={isAddAdminOpen}
          setIsOpen={setIsAddAdminOpen}
        />
      )}
    </div>
  );
}

export default AdminManagementPage;
