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
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface TopicFormData {
  name: string;
  language: string;
}

interface TopicAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: any | null;
  topicsData?: any[];
  setTopicsData?: (topicsData: any[]) => void;
  languageData?: any;
}

export function TopicAddForm({isOpen, setIsOpen, editData, topicsData, setTopicsData, languageData}: TopicAddFormProps) {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFilePreview, setSelectedFilePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useToken();

  // form handle
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
      name: editData?.name || "",
      language: editData?.language?.id
        ? String(editData?.language?.id)
        : editData?.language
        ? String(editData?.language)
        : "",
    }
  });

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      const languageValue = editData?.language?.id || editData?.language || "";
      setTimeout(() => {
        setValue("language", languageValue ? String(languageValue) : "");
      }, 100);
      if (editData.icon) {
        setSelectedFileName(editData.icon);
        setSelectedFilePreview(editData.image_url || "");
      }
    } else {
      setSelectedFileName("");
      setSelectedFilePreview("");
    }
  }, [editData, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Check if it's PNG or JPG image file
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select only PNG or JPG image file");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
      // Create preview URL for image files
      const previewUrl = URL.createObjectURL(file);
      setSelectedFilePreview(previewUrl);
    } else {
      setSelectedFile(null);
      setSelectedFileName("");
      setSelectedFilePreview("");
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: TopicFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("language_id", data.language);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      if (editData?.id) {
        // Update existing item
        const endpoint = `/admin/categories/${editData.id}`;
        const response = await UserService.updateQuestion(endpoint, formData, token);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
            const updatedData = topicsData.map(item => item.id === editData?.id ? {...response.data.data, image_url: response.data.data.image_url || editData.image_url } : item)
          setTopicsData?.(updatedData);
          reset();
          setSelectedFile(null);
          setSelectedFileName("");
          setSelectedFilePreview("");
          setIsOpen(false);
        }
      } else {
        // Add new item
        const endpoint = `/admin/categories`;
        const response = await UserService.addFormData(endpoint, formData, token);
        console.log("check",response);
        
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          const newList = [response?.data?.data, ...((topicsData as any[]) || [])];
          setTopicsData?.(newList);
          reset();
          setSelectedFile(null);
          setSelectedFileName("");
          setSelectedFilePreview("");
          setIsOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving topic:", error);
      toast.error("Failed to save topic");
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
            {/* Topic Name Input */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Topic Name
              </Label>
              <Input 
                id="name" 
                placeholder="Topic Name"
                {...register("name", { 
                  required: "Topic name is required",
                  minLength: {
                    value: 2,
                    message: "Topic name must be at least 2 characters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.name ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
                  <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        languageData?.data?.map((item: any) => (
                          <SelectItem key={item?.id} value={String(item?.id)}>{item?.name}</SelectItem>
                        ))
                      }
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
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={handleUploadAreaClick}
                >
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

                          {/* Image Preview */}
                          {selectedFilePreview && (
                            <div className="mt-3">
                              <Image 
                                src={selectedFilePreview} 
                                alt="File preview" 
                                width={100} 
                                height={100} 
                                className="object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Choose Image to upload</p>
                          <p className="text-gray-500 text-xs mt-1">PNG and JPG only (Max 5MB)</p>
                          {/* Show existing image if editing */}
                          {editData?.image_url && !selectedFileName && (
                            <div className="mt-3">
                              <Image 
                                src={editData.image_url} 
                                alt="Current topic media" 
                                width={100} 
                                height={100} 
                                className="object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hidden file input */}
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  id="file" 
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
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
                setSelectedFile(null);
                setSelectedFileName("");
                setSelectedFilePreview("");
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
