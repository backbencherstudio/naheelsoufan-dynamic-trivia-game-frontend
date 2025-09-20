import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user/user.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa6";
import { MdAdminPanelSettings, MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

// Form data interface
interface AddNewAdminFormData {
  email: string;
  displayName: string;
  password: string;
}

interface AddNewAdminFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  adminsData: any[];
}

export function AddNewAdminForm({ isOpen, setIsOpen, adminsData }: AddNewAdminFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AddNewAdminFormData>();
  const { token } = useToken();
  const onSubmit = async (data: AddNewAdminFormData) => {
    setLoading(true);
    try {
      const formdata = {
        email: data.email,
        name: data.displayName,
        password: data.password,
      }
      const response = await UserService.createData(`/admin/user`, formdata, token);
      console.log(response?.data?.data);
      
      if(response.data.success){
        toast.success(response.data.message);
        adminsData?.unshift(response?.data?.data);
        reset();
        setIsOpen(false);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.message);
      reset();
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[505px] p-0">
        <DialogHeader className="md:px-6 px-3 pt-3 md:pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="md:text-xl text-lg font-semibold text-gray-900 flex gap-2 items-center">
            <div className=" rounded-full flex items-center justify-center">
              <MdAdminPanelSettings  className="w-6 h-6 md:w-7 md:h-7 text-primaryColor/90 dark:text-whiteColor" />
            </div>
            Add New Admin
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 md:px-6 px-3 pb-6">
            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 dark:text-whiteColor">
              Create a new admin account with the following details:
            </p>
            
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Email
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="md:h-5 md:w-5 h-4 w-4 text-gray-400 dark:text-whiteColor" />
                </div>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full !h-12 md:pl-10 pl-8 pr-3 border border-gray-300 rounded-md bg-white ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            {/* Display Name Input */}
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 mb-2 block">
                Display Name
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="md:h-5 md:w-5 h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  id="displayName" 
                  type="text"
                  placeholder="Display Name"
                  {...register("displayName", { 
                    required: "Display name is required",
                    minLength: {
                      value: 2,
                      message: "Display name must be at least 2 characters"
                    }
                  })}
                  className={`w-full !h-12 md:pl-10 pl-8 pr-3 border border-gray-300 rounded-md bg-white ${errors.displayName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.displayName && (
                <p className="text-sm text-red-500 mt-1">{errors.displayName.message}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="md:h-5 md:w-5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                    }
                  })}
                  className={`w-full !h-12 md:pl-10 pl-8 pr-8 border border-gray-300 rounded-md bg-white ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-0 md:pr-3 pr-2 pl-2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="md:h-5 md:w-5 h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="md:h-5 md:w-5 h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end md:py-6 py-3 border-t border-headerColor/20">
            <div className="md:px-6 px-3 space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting || loading ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewAdminForm;
