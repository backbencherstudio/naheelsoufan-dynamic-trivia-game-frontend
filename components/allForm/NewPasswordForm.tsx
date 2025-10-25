"use client";
import React, { useEffect } from "react";

import { UserService } from "@/service/user/user.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(""); // Error state
  const router = useRouter();
  const [userMail, setUserMail] = useState<string | null>(null);
  const [isDisable, setIsdisable] = useState(false);

  useEffect(() => {
    setUserMail(localStorage.getItem("userEmail"));
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsdisable(true);
    // Handle login logic here
    if (newPassword === confirmPassword) {
      try {
        const res = await UserService.newPasswordSet({
          email: userMail,
          token: otp,
          password: confirmPassword,
        });
        console.log(res);

        if (res?.data.success === true) {
          toast.success(
            <p className="text-sm text-blackColor">
              {" "}
              Successfully Update your Pasword!
            </p>
          );
          setIsdisable(false);
          localStorage.removeItem("otp");
          localStorage.removeItem("userEmail");
          router.push("/login");
        } else {
          toast.error(
            <p className="text-sm text-blackColor"> Something went wrong.</p>
          );
        }
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;
        if (status === 400) {
          setError(message || "Something went wrong.");
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Sending OTP failed:", error);
      }
    } else {
      setError(" Wrong confirm password! Please type correct password.");
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className=" space-y-6">
        <div className="">
          <input
            type="password"
            placeholder="Enter your OTP code"
            className="w-full  px-2 lg:py-3 py-2 text-base  outline-0 font-normal   border border-grayColor bg-whiteColor rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <div className="">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full  px-2 lg:py-3 py-2 text-base  outline-0 font-normal  border border-grayColor bg-whiteColor rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-2 lg:py-3 py-2 text-base   outline-0 border border-grayColor bg-whiteColor rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className=" text-red-500 text-center text-sm mb-4">{error}</p>
        )}
        <button
          type="submit"
          className="w-full disabled:bg-bgbuttonColor/20 disabled:text-whiteColor/20 disabled:cursor-not-allowed cursor-pointer bg-primaryColor text-white py-2 rounded-full  transition-colors"
          disabled={isDisable}
        >
          {isDisable ? "Sending.." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default NewPasswordForm;
