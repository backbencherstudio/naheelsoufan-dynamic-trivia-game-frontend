
"use client";
import { AddNewAdminForm } from '@/components/allForm/AddNewAdminForm';
import { AdminResetPasswordForm } from '@/components/allForm/AdminResetPassword';
import DynamicTableTwo from '@/components/common/DynamicTableTwo';
import { useState } from "react";
import { HiShieldCheck } from 'react-icons/hi2';
import { RiDeleteBin6Line, RiRotateLockLine } from 'react-icons/ri';

function AdminManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Demo data matching the image
  const adminsData = [
    { 
      no: 1, 
      name: "SmartQuip", 
      email: "smartquip0@gmail.com", 
      created: "May 10, 2025" 
    },
    { 
      no: 2, 
      name: "Inzily Admin", 
      email: "admin@spamok.com", 
      created: "May 10, 2025" 
    },
    { 
      no: 3, 
      name: "Atul", 
      email: "atul.gautam@pixelcrayons.com", 
      created: "Jun 2, 2025" 
    },
    { 
      no: 4, 
      name: "walid", 
      email: "walid_h929@hotmail.com", 
      created: "Aug 23, 2025" 
    },
    { 
      no: 5, 
      name: "Zain", 
      email: "zain@spamok.com", 
      created: "May 10, 2025" 
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
      accessor: "created",
      width: "150px",
      formatter: (value: string) => (
        <span className="text-sm">{value}</span>
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
              className='text-xl cursor-pointer text-blue-600 hover:text-blue-800 dark:text-whiteColor dark:hover:text-blue-800'
            >
              <RiRotateLockLine size={24} />
            </button>
            <button 
              onClick={() => handleDelete(record)}
              className='text-xl cursor-pointer text-red-600 hover:text-red-800 '
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        );
      },
    },
  ];

  const handleEdit = (record: any) => {
    console.log("Resetting password for admin:", record);
    setSelectedAdmin({
      name: record.name,
      email: record.email
    });
    setIsResetPasswordOpen(true);
  };

  const handleDelete = (record: any) => {
    console.log("Deleting admin:", record);
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
          <DynamicTableTwo
            columns={columns}
            data={adminsData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPageOptions={[5, 10, 20, 50]}
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
        />
      )}
    </div>
  );
}

export default AdminManagementPage;
