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
import useTranslation from "@/hooks/useTranslation";
import { UserService } from "@/service/user/user.service";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface DifficultyFormData {
  name: string;
  language: string;
  points: number | string;
}

interface DifficultyAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?:any| {};
  difficultiesData?: any[];
  setDifficultiesData?: (difficultiesData: any[]) => void;
  }

export function DifficultyAddForm({ isOpen, setIsOpen, editData, difficultiesData, setDifficultiesData }: DifficultyAddFormProps) {
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
      name: editData?.name || "",
      language: editData?.language?.id || editData?.language || "",
      points: editData?.points || "",
    }
  });
  const {t}=useTranslation()
  const { token } = useToken();
  // Update form values when editData changes
  useEffect(() => {
    if (editData && editData.id) {
      // Edit mode - populate form with existing data
      setValue("name", editData.name || "");
      setValue("points", editData.points || 0);
      const languageValue = editData?.language?.id || editData?.language || "";
      // Small delay to ensure language data is loaded
      setTimeout(() => {
        setValue("language", languageValue);
        console.log("Setting language value:", languageValue);
      }, 100);
    } else {
      // Create mode - clear all fields
      reset({
        name: "",
        language: "",
        points: ""
      });
    }
  }, [editData, setValue, reset]);
  const { data: languageData } = useDataFetch(`/admin/languages`);

  const onSubmit = async (data: DifficultyFormData) => {

    const formData ={
      language_id: data.language,
      name: data.name,
      points: Number(data.points)
    }
    try {
      if (editData?.id) {
        // Update existing item
        const endpoint = `/admin/difficulties/${editData.id}`;
        const response = await UserService.updateData(endpoint, formData, token);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          const updatedData = difficultiesData.map(item =>
            item.id === editData.id
              ? { ...item, name: data.name, language: data.language, language_id: data.language, points: data.points }
              : item
          );
          setDifficultiesData(updatedData);
          reset({
            name: "",
            language: "",
            points: ""
          });
          setIsOpen(false);
        }
      } else {
        // Add new item
        const endpoint = `/admin/difficulties`;
        const response = await UserService.createData(endpoint, formData, token);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          difficultiesData.unshift(response?.data?.data);
          reset({
            name: "",
            language: "",
            points: ""
          });
          setIsOpen(false);
        }
      }

    } catch (error) {
      console.error("Error saving difficulty:", error);
      toast.error("Failed to save difficulty");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? t("update_difficulty") : t("create_difficulty")}
          </DialogTitle>
        </DialogHeader>
        <form key={editData?.id || `new-${Date.now()}`} onSubmit={handleSubmit(onSubmit)} >
          <div className="space-y-6 px-6 pb-6 pt-4">
            {/* Difficulty Name Input */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("difficulty_name")}
              </Label>
              <Input
                id="name"
                placeholder={t("difficulty_name")}
                {...register("name", {
                  required: t("difficulty_name_is_required"),
                  minLength: {
                    value: 2,
                    message: t("difficulty_name_must_be_at_least_2_characters")
                  }
                })}
                className={`w-full h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : ""}  dark:text-whiteColor`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
         
            <div>
              <Label htmlFor="points" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("point")}
              </Label>
              <Input
                id="points"
                type="number"
                placeholder={t("difficulty_points")}
                {...register("points", {
                  required: t("difficulty_points_is_required"),
                  min: {
                    value: 1,
                    message: t("points_must_be_at_least_1")
                  }
                })} 
                className={`w-full !h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.points ? "border-red-500" : ""}  dark:text-whiteColor`}
              />
              {errors.points && (
                <p className="text-sm text-red-500 mt-1">{errors.points.message}</p>
              )}
            </div>
            {/* Language Selection */}
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("language")}
              </Label>
              <Controller
                name="language"
                control={control}
                rules={{ required: t("language_is_required") }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`w-full !h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.language ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("language")} />
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
          <div className="flex justify-end px-6 py-6 border-t border-headerColor/20">
            <div className="space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset({
                    name: "",
                    language: "",
                    points: ""
                  });
                  setIsOpen(false);
                }}
                className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting ? (editData ? t("updating") : t("creating")) : (editData ? t("update_difficulty") : t("create_difficulty"))}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
