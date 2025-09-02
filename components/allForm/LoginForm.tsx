"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
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

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-headerColor">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <div className="flex justify-between gap-3 mt-6">
            <Button
              type="button"
              className="flex items-center gap-1 bg-grayColor1/20 text-descriptionColor px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-1 bg-primaryColor text-white px-4 py-2 lg:py-3 lg:px-6 rounded-md text-sm font-medium"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
