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
import useTranslation from "@/hooks/useTranslation";
import { UserService } from "@/service/user/user.service";
import { useForm } from "react-hook-form";
import { RiRotateLockLine } from "react-icons/ri";
import { toast } from "react-toastify";

// Form data interface
interface AdminResetPasswordFormData {
  name: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminResetPasswordFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  adminData?: {
    id: string;
    name: string;
    email: string;
  } | null;
  adminsData: any[];
  setAdminsData: (data: any[]) => void;
}

export function AdminResetPasswordForm({ isOpen, setIsOpen, adminData, adminsData, setAdminsData }: AdminResetPasswordFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<AdminResetPasswordFormData>({
    defaultValues: {
      name: adminData?.name || "",
      email: adminData?.email || "",
      newPassword: "",
      confirmPassword: ""
    }
  });
 const {token} = useToken();
  const newPassword = watch("newPassword");
  const {t} = useTranslation();

  const onSubmit = async (data: AdminResetPasswordFormData) => {
    const formdata = {
      name: data.name,
      email: data.email,
      password: data.confirmPassword
    }
    try {
      const response = await UserService.updateData(`/admin/user/${adminData?.id}`, formdata, token);
      if(response.data.success){
        toast.success(response.data.message);
        reset();
        setIsOpen(false);
        const updatedData = adminsData.map(item => item.id === adminData?.id ? response.data.data : item);
        setAdminsData(updatedData);
      }else{
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.message || t("something_went_wrong"));
      toast.error(error.message);
      reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="md:px-6 px-3 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-lg md:text-xl flex gap-2 items-center font-semibold text-gray-900 dark:text-whiteColor">
            <RiRotateLockLine size={24} className="text-primaryColor" />  {t("update_admin_information")}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 md:px-6 px-3 pb-6">
            {/* Admin Info Display */}
            <h3 className="text-sm font-normal text-headerColor mb-2 dark:text-whiteColor">{t("update_information_for_admin")}:</h3>
            
            
            {/* New Password Input */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("name")}
              </Label>
              <Input 
                id="name" 
                type="text"
                placeholder={t("enter_new_name")}
                {...register("name", { 
                  required: t("name_is_required"),
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("email")}
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder={t("enter_new_email")}
                {...register("email", { 
                  required: t("email_is_required"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("invalid_email_address")
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("new_password")}
              </Label>
              <Input 
                id="newPassword" 
                type="password"
                placeholder={t("enter_new_password")}
                {...register("newPassword", {
                  minLength: {
                    value: 8,
                    message: t("password_must_be_at_least_8_characters")
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: t("strong_password_hint")
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.newPassword ? "border-red-500" : ""}`}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            
            {/* Confirm Password Input */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  {t("confirm_password")}
              </Label>
              <Input 
                id="confirmPassword" 
                type="password"
                placeholder={t("confirm_new_password")}
                {...register("confirmPassword", { 
                  validate: (value) => 
                    value === newPassword || t("password_mismatch")
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end py-6 border-t border-headerColor/20">
            <div className="md:px-6 px-3 space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 dark:bg-whiteColor dark:text-blackColor"
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 dark:bg-whiteColor dark:text-blackColor"
              >
                {isSubmitting ? t("updating") : t("update_admin_information")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminResetPasswordForm;
