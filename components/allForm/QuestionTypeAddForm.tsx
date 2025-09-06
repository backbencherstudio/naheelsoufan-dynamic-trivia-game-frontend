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
  questionTypeName: string;
  language: string;
}

interface TopicAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: {
    questionTypeName: string;
    language: string;       
  } | null;
}

export function QuestionAddForm({isOpen, setIsOpen, editData}: TopicAddFormProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
      questionTypeName: editData?.questionTypeName || "",
      language: editData?.language || "",
    }
  });

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("questionTypeName", editData.questionTypeName);
      setValue("language", editData.language);
      if (editData.questionTypeName) {
        setSelectedFileName(editData.questionTypeName || null);
      }
    } else {
      setSelectedFileName(null);
    }
  }, [editData, setValue]);


  const onSubmit = async (data: TopicFormData) => {
    try {
      console.log("Question Type Name:", data.questionTypeName);
      console.log("Language:", data.language);
      
      // Reset form and close dialog on success
      reset();
      setSelectedFileName(null);
      setIsOpen(false);
      
      // Show success message
      console.log(editData ? "Question type updated successfully!" : "Question type added successfully!");
    } catch (error) {
      console.error("Error saving question type:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {editData ? "Edit Question Type" : "Add Question Type"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-4 px-6 pb-6">
            {/* Language Input */}
            <div>
              <Label htmlFor="questionTypeName" className="text-sm font-medium text-gray-700 mb-2 block">
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
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.questionTypeName ? "border-red-500" : ""}`}
              />
              {errors.questionTypeName && (
                <p className="text-sm text-red-500 mt-1">{errors.questionTypeName.message}</p>
              )}
            </div>
            
            {/* Language Selection */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block">
                Select Language
              </Label>
              <Controller
                name="language"
                control={control}
                rules={{ required: "Language selection is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""}`}>
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
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end  py-6   border-t border-headerColor/20">
          <div className="px-6 space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setSelectedFileName(null);
                setIsOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
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
