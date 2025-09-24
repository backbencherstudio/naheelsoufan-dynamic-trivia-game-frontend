import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDataFetch from "@/hooks/useDataFetch";
import { useToken } from "@/hooks/useToken";
import { UserService } from "@/service/user/user.service";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface TopicFormData {
  questionTypeName: string;
  language: string;
}

interface TopicAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: any | null;

  questionData?: any[];
  setQuestionData?: (questionData: any[]) => void;
}

export function QuestionAddForm({ isOpen, setIsOpen, editData, questionData, setQuestionData }: TopicAddFormProps) {

  const { token } = useToken();
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
      questionTypeName: editData?.name || "",
      language: editData?.language || "",
    }
  });
  const { data: languageData } = useDataFetch(`/admin/languages`);
  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("questionTypeName", editData.name);
      const languageValue = editData?.language?.id || editData?.language || "";

      setTimeout(() => {
        setValue("language", languageValue);
      }, 100);
      setValue("language", editData.language);

    } else {
      reset();
    }
  }, [editData, setValue]);


  const onSubmit = async (data: TopicFormData) => {
    console.log(data.language);
     
    const formData = {
      language_id: data.language,
      name: data.questionTypeName
    }
    try {
      if (editData?.id) {
        // Update existing item
        const endpoint = `/admin/question-types/${editData.id}`;
        const response = await UserService.updateData(endpoint, formData, token);
        console.log(response);
        
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          const updatedData = questionData.map(item =>
            item.id === editData.id
              ? { ...item, name: data.questionTypeName, language:{name: languageData?.data?.filter((item)=>item?.id === data.language)[0]?.name} }
              : item
          );
          setQuestionData(updatedData);
          reset();
          setIsOpen(false);
        }
      } else {
        // Add new item
        const endpoint = `/admin/question-types`;
        const response = await UserService.createData(endpoint, formData, token);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          questionData.unshift(response?.data?.data)
          reset();
          setIsOpen(false);
        }
      }

    } catch (error) {
      console.error("Error saving question type:", error);
      toast.error("Failed to save question type");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? "Edit Question Type" : "Add Question Type"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 px-6 pb-6">
            {/* Language Input */}
            <div>
              <Label htmlFor="questionTypeName" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Question Type Name
              </Label>
              <Input
                id="questionTypeName"
                placeholder="Question Type Name"
                {...register("questionTypeName", {
                  required: "Question type name is required",
                  minLength: {
                    value: 2,
                    message: "Question type name must be at least 2 characters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.questionTypeName ? "border-red-500" : ""}  dark:text-whiteColor dark:bg-blackColor`}
              />
              {errors.questionTypeName && (
                <p className="text-sm text-red-500 mt-1">{errors.questionTypeName.message}</p>
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
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor`}>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        languageData?.data?.map((item: any) => (
                          <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end  py-6   border-t border-headerColor/20">
            <div className="px-6 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                className="px-4 py-2 border border-gray-300 bg-white dark:text-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? "Update Question Type" : "Add Question Type")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
