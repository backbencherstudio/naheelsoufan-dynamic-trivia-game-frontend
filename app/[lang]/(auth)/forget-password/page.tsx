"use client"
import { UserService } from "@/service/user/user.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbArrowBack } from "react-icons/tb";
import { toast } from "react-toastify";
function ForgetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isDisable, setIsdisable]= useState(false)
  const  route = useRouter()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log(email);
     setIsdisable(true)
             try {
               const response = await UserService.forgotPassword(email)
               console.log(response);
               
               if(response.status === 201) {                  
                 setIsdisable(false)
                  route.push("/forget-password/new-password")
                 toast.success(<p className="text-sm text-blackColor"> We have sent an OTP code to your email!</p>)
                 localStorage.setItem("userEmail", email)
               }
               
             } catch (error) {
               toast.error(<p className="text-base text-blackColor">{error.message || "please correct email"}</p>)
               console.log(error);
               setIsdisable(false)
               
             }
   
    
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200"> 
      <section className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 transition-colors duration-200" style={{
        boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)",
      }}>

      <Link href="/login" className= " flex gap-2  text-base items-center">
        <TbArrowBack className=" text-lg " /> Back
      </Link>
          
        <div className="flex  items-center justify-center">
          <div className="w-full max-w-xl  relative text-center">
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-center text-blackColor mb-3 lg:mb-6">
              Forgot password?
            </h1>
            <p className="text-blackColor font-normal text-base mb-6">Enter your email for the verification process, we will send 6 digits code to your email.</p>
            {/* Login Container */}
            <div className="">
              <form onSubmit={handleSubmit} className="">
                <div className="pb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-2 py-2 lg:py-3 text-base outline-0 font-normal  border border-grayColor bg-whiteColor rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-2 rounded-md transition-all duration-200 ${isDisable
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                    : 'bg-primaryColor hover:bg-primaryColor/90 active:bg-primaryColor/80 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800 text-white'
                    }`}
                  disabled={isDisable}
                >
                  {isDisable ? "Sending..." : "Next"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}

export default ForgetPasswordPage
