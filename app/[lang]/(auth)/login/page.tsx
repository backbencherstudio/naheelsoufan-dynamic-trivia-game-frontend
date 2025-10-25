"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CookieHelper } from "@/helper/cookie.helper";
import { UserService } from "@/service/user/user.service";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
type LoginFormInputs = {
  email: string;
  password: string;
};
export default function LoginPage() {
  const [isDisable, setIsDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsDisable(true);
    try {
      const response = await UserService.login(data);
      if (response.data?.success === true) {
        const tokenNumber = response.data.authorization.token;
        CookieHelper.set({
          key: "gametoken",
          value: tokenNumber,
        });
        toast.success("Successfully login!");
        router.push("/");
        reset()
        setIsDisable(false);
      }
    } catch (error) {
      toast.error("Wrong Email or Password");
      setIsDisable(false);
    } finally {
      setIsDisable(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      <div className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 transition-colors duration-200" style={{
        boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)",
      }}>
        <h2 className="text-2xl font-bold text-center text-headerColor dark:text-white transition-colors duration-200">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor dark:text-white transition-colors duration-200">Email</Label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="example@example.com"
              className="rounded-md !h-[45px] text-[14px] text-grayColor dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 border-gray-300 focus:border-blue-500 transition-colors duration-200"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor dark:text-white transition-colors duration-200">Password</Label>
            <div className="relative">
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                className="rounded-md !h-[45px] text-[14px] pr-10 text-grayColor dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 border-gray-300 focus:border-blue-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>
          <div className="text-right">
            <Link href="/forget-password" className="text-sm  text-blue-600 hover:underline dark:text-blue-400 transition-colors duration-200"> Forgot Password </Link>
          </div>
          <div className="w-full gap-3 mt-6">
            <button
              type="submit"
              className={`w-full py-2 rounded-md transition-all duration-200 ${isDisable
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                : 'bg-primaryColor hover:bg-primaryColor/90 active:bg-primaryColor/80 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800 text-white'
                }`}
              disabled={isDisable}
            >
              {isDisable ? "Sending..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
