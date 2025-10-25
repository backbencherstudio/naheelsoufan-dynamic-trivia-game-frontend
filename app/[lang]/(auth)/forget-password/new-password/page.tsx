
  import NewPasswordForm from "@/components/allForm/NewPasswordForm";
import Link from "next/link";

  import { TbArrowBack } from "react-icons/tb";
  function NewPassword() {
    return (
      <section className=" w-full flex flex-col items-center justify-center  md:h-screen bg-white p-4"  >        
          <div className="w-full max-w-md  p-6 lg:p-8 rounded-lg " style={{
            boxShadow: "2px 2px 7px 2px rgba(77, 47, 47, 0.1)",
          }}>
            <div className="w-full relative text-center">
              <Link href="/forget-password" className= " flex gap-2  text-base items-center">
          <TbArrowBack className=" text-lg " /> Back
        </Link>
              <h1 className="text-2xl md:text-3xl lg:tex  t-[32px] font-semibold text-center text-blackColor mb-2">
                New Password
              </h1>
              <p className="text-blackColor font-normal text-base lg:px-24 mb-6">Write your new password</p>
              <NewPasswordForm/>
            </div>
          </div>  
        </section>
    )
  }
  export default NewPassword
