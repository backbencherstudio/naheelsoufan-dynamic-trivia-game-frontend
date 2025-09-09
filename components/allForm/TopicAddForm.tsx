import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface TopicFormData {
  topicName: string;
  language: string;
  file: FileList;
}

interface TopicAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: {
    topicName: string;
    language: string;
    icon?: string;
  } | null;
}

export function TopicAddForm({isOpen, setIsOpen, editData}: TopicAddFormProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<TopicFormData>({
    defaultValues: {
      topicName: editData?.topicName || "",
      language: editData?.language || "",
    }
  });

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("topicName", editData.topicName);
      setValue("language", editData.language);
      if (editData.icon) {
        setSelectedFileName(editData.icon);
      }
    } else {
      setSelectedFileName("");
    }
  }, [editData, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("");
    }
  };

  const onSubmit = async (data: TopicFormData) => {
    try {
      console.log("Topic Name:", data.topicName);
      console.log("Language:", data.language);
      console.log("File:", data.file[0]);
      
      // Here you would typically send the data to your API
      // await apiCall(data);
      
      // Reset form and close dialog on success
      reset();
      setSelectedFileName("");
      setIsOpen(false);
      
      // Show success message
      console.log(editData ? "Topic updated successfully!" : "Topic added successfully!");
    } catch (error) {
      console.error("Error saving topic:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? "Edit Topic" : "Add Topic"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 px-6 pb-6">
            {/* Language Input */}
            <div>
              <Label htmlFor="topicName" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Topic Name
              </Label>
              <Input 
                id="topicName" 
                placeholder="Topic Name"
                {...register("topicName", { 
                  required: "Topic name is required",
                  minLength: {
                    value: 2,
                    message: "Topic name must be at least 2 characters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.topicName ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
              />
              {errors.topicName && (
                <p className="text-sm text-red-500 mt-1">{errors.topicName.message}</p>
              )}
            </div>
            
            {/* Language Selection */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Select Language
              </Label>
              <Controller
                name="language"
                control={control}
                rules={{ required: "Language selection is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="arabic">عربي</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && (
                <p className="text-sm text-red-500 mt-1">{errors.language.message}</p>
              )}
            </div>
            
            {/* File Upload Section */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Upload Topic Icon
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
                      {selectedFileName ? (
                        <div>
                          <p className="text-green-600 text-sm font-medium">✓ File Selected</p>
                          <p className="text-gray-600 text-xs mt-1 break-all">{selectedFileName}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Choose Icon to upload</p>
                          <p className="text-gray-500 text-xs mt-1">jpg/png</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hidden file input that only covers the upload area */}
                <Input 
                  type="file" 
                  id="file" 
                  accept="image/jpeg,image/png" 
                  {...register("file", { 
                    required: "Topic Icon file is required",
                    validate: (files) => {
                      if (files && files[0]) {
                        const file = files[0];
                        if (file.type !== "image/jpeg" && file.type !== "image/png") {
                          return "Please upload a jpg/png file";
                        }
                        if (file.size > 5 * 1024 * 1024) { // 5MB limit
                          return "File size must be less than 5MB";
                        }
                      }
                      return true;
                    }
                  })}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {errors.file && (
                <p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end  py-6   border-t border-headerColor/20">
          <div className="px-6 space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setSelectedFileName("");
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
              {isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? "Update Topic" : "Add Topic")}
            </Button>
          </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
