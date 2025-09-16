
"use client";
import { AddNewAdminForm } from '@/components/allForm/AddNewAdminForm';
import { AdminResetPasswordForm } from '@/components/allForm/AdminResetPassword';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { useDebounce } from '@/helper/debounce.helper';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
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
  const [selectedAdmin, setSelectedAdmin] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const { token } = useToken();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // API endpoint with search
  const endpoint = `/admin/user?page=${currentPage}&limit=${itemsPerPage}&q=${search}`;
  const { data, loading } = useDataFetch(endpoint);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam) {
      setSearch(adminParam);
    }
  }, [searchParams]);

  // Update admins data when API response changes
  useEffect(() => {
    if (data?.data?.length > 0) {
      setAdminsData(data?.data);
    }
    if (data) {
      setPaginationData(data?.pagination);
    }
  }, [data]);

  // Search function
  const searchFunction = useCallback((searchValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchValue === '') {
      params.delete('admin');
    } else {
      params.set('admin', searchValue);
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
      label: "Name",
      accessor: "name",
      width: "200px",
      formatter: (value: string) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Email",
      accessor: "email",
      width: "250px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      label: "Created",
      accessor: "created_at",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm">{dayjs(value).format("MMMM DD, YYYY")}</span>
      ),
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
      const response = await UserService.deleteData(`/admin/user/${record.id}`, token);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        const updatedData = adminsData.filter(item => item?.id !== record?.id);
        setAdminsData(updatedData);
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddAdmin = () => {
    console.log("Adding new admin...");
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
          <h1 className="md:text-2xl text-xl font-semibold text-gray-900 dark:text-whiteColor">Admin Management</h1>
        </div>
        <div className='flex justify-end'>
        <button 
          onClick={handleAddAdmin}
          className="bg-blue-600  text-white font-medium rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 flex items-center gap-2 dark:bg-whiteColor dark:text-blackColor"
        >
          <span className="text-lg">+</span>
          Add Admin
        </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg shadow-sm">
        <div className="p-5">
          {/* Search Section */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-whiteColor">Admin List</h2>
            <div className="relative w-64">
              <input 
                value={search}
                onChange={handleSearch}
                type="text" 
                placeholder="Search admins..." 
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
            loading={loading}
          />
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <AdminResetPasswordForm 
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
          adminsData={adminsData}
        />
      )}
    </div>
  );
}

export default AdminManagementPage;
