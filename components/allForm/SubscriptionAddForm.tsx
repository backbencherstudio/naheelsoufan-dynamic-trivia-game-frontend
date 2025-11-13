import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddServiceTypeMutation, useGetLanguagesQuery, useUpdateServiceTypeMutation } from "@/feature/api/apiSlice";
import { useToken } from "@/hooks/useToken";
import useTranslation from "@/hooks/useTranslation";
import { SubscriptionType } from "@/types";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Form data interface
interface SubscriptionFormData {
  subscriptionType: string;
  language: string;
  numberOfGames: number;
  numberOfQuestions: number;
  numberOfPlayers: number;
  price: number;
}

interface SubscriptionAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: SubscriptionType;
 
}

export function SubscriptionAddForm({ isOpen, setIsOpen, editData}: SubscriptionAddFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      subscriptionType: editData?.type || "",
      language: editData?.language?.id || "",
      numberOfGames: editData?.games ?? undefined,
      numberOfQuestions: editData?.questions ?? undefined,
      numberOfPlayers: editData?.players ?? undefined,
      price: editData?.price ?? undefined,
    }
  });
  const { token } = useToken()
 const {t}=useTranslation()
 const {data:languageData} = useGetLanguagesQuery({params:`limit=1000&page=1`})
 const [addServiceType]= useAddServiceTypeMutation()
 const [updateServiceType]= useUpdateServiceTypeMutation()
  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("subscriptionType", editData.type);
      setValue("language", editData.language.id);
      setValue("numberOfGames", editData.games);
      setValue("numberOfQuestions", editData.questions);
      setValue("numberOfPlayers", editData.players);
      setValue("price", editData.price);
    }
  }, [editData, setValue]);

  const onSubmit = async (data: SubscriptionFormData) => {
    const formData = new FormData()
    formData.append("type", data.subscriptionType)
    formData.append("language_id", data.language)
    formData.append("games", data.numberOfGames.toString())
    formData.append("questions", data.numberOfQuestions.toString())
    formData.append("players", data.numberOfPlayers.toString())
    formData.append("price", data.price.toString())
    try {
      if (editData?.id) {
        // Update existing item
        const response = await updateServiceType({id:editData.id ,data:formData});
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          reset();
          setIsOpen(false);
        }
      } else {
        // Add new item
        const response = await addServiceType({data : formData});
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          reset();
          setIsOpen(false);
        }
      }
      // Reset form and close dialog on success
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving subscription type:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? t("eidt_subscription_type") : t("add_subscription_type")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 pb-6">
            {/* Subscription Type Input */}
            <div>
              <Label htmlFor="subscriptionType" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                {t("subscription_type")}
              </Label>
              <Input
                id="subscriptionType"
                placeholder={t("subscription_type")}
                {...register("subscriptionType", {
                  required: t("subscription_type_is_required"),
                 
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.subscriptionType ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor`}
              />
              {errors.subscriptionType && (
                <p className="text-sm text-red-500 mt-1">{errors.subscriptionType.message}</p>
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
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""}`}>
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

            {/* Two Column Grid for Number of Games and Number of Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfGames" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  {t("number_of_games")}
                </Label>
                <Input
                  id="numberOfGames"
                  placeholder={t("number_of_games")}
                  type="number"
                  {...register("numberOfGames", {
                    required: t("number_of_games_is_required"),
                   
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfGames ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor`}
                />
                {errors.numberOfGames && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfGames.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="numberOfQuestions" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  {t("number_of_question")}
                </Label>
                <Input
                  id="numberOfQuestions"
                  placeholder={t("number_of_question")}
                  type="number"
                  {...register("numberOfQuestions", {
                    required: t("number_of_questions_is_required"),
                   
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfQuestions ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor`}
                />
                {errors.numberOfQuestions && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfQuestions.message}</p>
                )}
              </div>
            </div>

            {/* Two Column Grid for Number of Players and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfPlayers" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  {t("number_of_players")}
                </Label>
                <Input
                  id="numberOfPlayers"
                  placeholder={t("number_of_players")}
                  type="number"
                  {...register("numberOfPlayers", {
                    required: t("players_is_required"),
                    
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfPlayers ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor`}
                />
                {errors.numberOfPlayers && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfPlayers.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  {t("price")}
                </Label>
                <Input
                  id="price"
                  placeholder={t("price")}
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: t("price_is_required"),
                   
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.price ? "border-red-500" : ""} dark:text-whiteColor dark:bg-blackColor `}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end py-6 border-t border-headerColor/20">
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
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? t("update_subscription_type") : t("add_subscription_type"))}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
