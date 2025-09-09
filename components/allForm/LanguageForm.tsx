import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

// Form data interface
interface LanguageFormData {
  language: string;
  languageCode: string;
  file: FileList;
}

export function LanguageForm({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<LanguageFormData>();

  const onSubmit = async (data: LanguageFormData) => {
    try {
      console.log("Language:", data.language);
      console.log("Language Code:", data.languageCode);
      console.log("File:", data.file[0]);
      reset();
      setIsOpen(false);
      
      // Show success message
      console.log("Language added successfully!");
    } catch (error) {
      console.error("Error adding language:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">Add Language</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 px-6 pb-6">
            {/* Language Input */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Language
              </Label>
              <Input 
                id="language" 
                placeholder="Language"
                {...register("language", { 
                  required: "Language name is required",
                  minLength: {
                    value: 2,
                    message: "Language name must be at least 2 characters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.language ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
              />
              {errors.language && (
                <p className="text-sm text-red-500 mt-1">{errors.language.message}</p>
              )}
            </div>
            
            {/* Language Code Input */}
            <div>
              <Label htmlFor="languageCode" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Language Code
              </Label>
              <Input 
                id="languageCode" 
                placeholder="Language Code"
                {...register("languageCode", { 
                  required: "Language code is required",
                  pattern: {
                    value: /^[a-z]{2,3}$/,
                    message: "Language code must be 2-3 lowercase letters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.languageCode ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
              />
              {errors.languageCode && (
                <p className="text-sm text-red-500 mt-1">{errors.languageCode.message}</p>
              )}
            </div>
            
            {/* File Upload Section */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Choose file to upload
              </Label>
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    {/* Upload Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-blue-600 text-sm font-medium">choose file to upload</p>
                      <p className="text-gray-500 text-xs mt-1">JSON</p>
                    </div>
                  </div>
                </div>
                
                {/* Hidden file input that only covers the upload area */}
                <Input 
                  type="file" 
                  id="file" 
                  accept="application/json,.json" 
                  {...register("file", { 
                    required: "Language file is required",
                    validate: (files) => {
                      if (files && files[0]) {
                        const file = files[0];
                        if (file.type !== "application/json") {
                          return "Please upload a JSON file";
                        }
                        if (file.size > 5 * 1024 * 1024) { // 5MB limit
                          return "File size must be less than 5MB";
                        }
                      }
                      return true;
                    }
                  })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {errors.file && (
                <p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end  py-6  border-t border-headerColor/20">
          <div className="px-6 space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 dark:bg-whiteColor dark:text-blackColor"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Language"}
            </Button>
          </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
