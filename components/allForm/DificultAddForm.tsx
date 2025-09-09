import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface DifficultyFormData {
  difficultyName: string;
  language: string;
}

interface DifficultyAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: {
    difficultyName: string;
    language: string;       
  } | null;
}

export function DifficultyAddForm({isOpen, setIsOpen, editData}: DifficultyAddFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<DifficultyFormData>({
    defaultValues: {
      difficultyName: editData?.difficultyName || "",
      language: editData?.language || "",
    }
  });

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("difficultyName", editData.difficultyName);
      setValue("language", editData.language);
    }
  }, [editData, setValue]);

  const onSubmit = async (data: DifficultyFormData) => {
    try {
      console.log("Difficulty Name:", data.difficultyName);
      console.log("Language:", data.language);
      
      // Reset form and close dialog on success
      reset();
      setIsOpen(false);
      
      // Show success message
      console.log(editData ? "Difficulty updated successfully!" : "Difficulty added successfully!");
    } catch (error) {
      console.error("Error saving difficulty:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? "Edit Difficulty" : "Create Difficulty"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-6 px-6 pb-6 pt-4">
            {/* Difficulty Name Input */}
            <div>
              <Label htmlFor="difficultyName" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Difficulty Name
              </Label>
              <Input 
                id="difficultyName" 
                placeholder="Difficulty Name"
                {...register("difficultyName", { 
                  required: "Difficulty name is required",
                  minLength: {
                    value: 2,
                    message: "Difficulty name must be at least 2 characters"
                  }
                })}
                className={`w-full h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.difficultyName ? "border-red-500" : ""}  dark:text-whiteColor`}
              />
              {errors.difficultyName && (
                <p className="text-sm text-red-500 mt-1">{errors.difficultyName.message}</p>
              )}
            </div>
            
            {/* Language Selection */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Language
              </Label>
              <Controller
                name="language"
                control={control}
                rules={{ required: "Language selection is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`w-full h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.language ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Language" />
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
          <div className="flex justify-end px-6 py-6 border-t border-headerColor/20">
            <div className="space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
                className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? (editData ? "Updating..." : "Creating...") : (editData ? "Update Difficulty" : "Create Difficulty")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
