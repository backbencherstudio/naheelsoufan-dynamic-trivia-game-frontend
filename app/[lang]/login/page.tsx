"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CookieHelper } from "@/helper/cookie.helper";
import { UserService } from "@/service/user/user.service";
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
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg " style={{
        boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)", // uniform shadow all sides
      }}>
        <h2 className="text-2xl font-bold text-center text-headerColor">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Email</Label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="example@example.com"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[14px] font-medium text-headerColor">Password</Label>
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              placeholder="Your password"
              className="rounded-md !h-[45px] text-[14px] text-grayColor"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>
          <div className="w-full gap-3 mt-6">
            <button
              type="submit"
              className="w-full  disabled:bg-blackColor/50 disabled:cursor-not-allowed cursor-pointer bg-primaryColor text-white py-2 rounded-md  transition-colors"
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
