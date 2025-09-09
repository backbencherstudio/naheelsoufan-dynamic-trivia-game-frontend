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
interface SubscriptionFormData {
  subscriptionType: string;
  language: string;
  numberOfGames: string;
  numberOfQuestions: string;
  numberOfPlayers: string;
  price: string;
}

interface SubscriptionAddFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editData?: {
    subscriptionType: string;
    language: string;
    numberOfGames: string;
    numberOfQuestions: string;
    numberOfPlayers: string;
    price: string;
  } | null;
}

export function SubscriptionAddForm({isOpen, setIsOpen, editData}: SubscriptionAddFormProps) {
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
      subscriptionType: editData?.subscriptionType || "",
      language: editData?.language || "",
      numberOfGames: editData?.numberOfGames || "",
      numberOfQuestions: editData?.numberOfQuestions || "",
      numberOfPlayers: editData?.numberOfPlayers || "",
      price: editData?.price || "",
    }
  });

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("subscriptionType", editData.subscriptionType);
      setValue("language", editData.language);
      setValue("numberOfGames", editData.numberOfGames);
      setValue("numberOfQuestions", editData.numberOfQuestions);
      setValue("numberOfPlayers", editData.numberOfPlayers);
      setValue("price", editData.price);
    }
  }, [editData, setValue]);

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      console.log("Subscription Type:", data.subscriptionType);
      console.log("Language:", data.language);
      console.log("Number of Games:", data.numberOfGames);
      console.log("Number of Questions:", data.numberOfQuestions);
      console.log("Number of Players:", data.numberOfPlayers);
      console.log("Price:", data.price);
      
      // Reset form and close dialog on success
      reset();
      setIsOpen(false);
      
      // Show success message
      console.log(editData ? "Subscription type updated successfully!" : "Subscription type added successfully!");
    } catch (error) {
      console.error("Error saving subscription type:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[505px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b-[1px] border-headerColor/20">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-whiteColor">
            {editData ? "Edit Subscription Type" : "Add Subscription Type"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 pb-6">
            {/* Subscription Type Input */}
            <div>
              <Label htmlFor="subscriptionType" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                Subscription Type
              </Label>
              <Input 
                id="subscriptionType" 
                placeholder="Subscription Type"
                {...register("subscriptionType", { 
                  required: "Subscription type is required",
                  minLength: {
                    value: 2,
                    message: "Subscription type must be at least 2 characters"
                  }
                })}
                className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.subscriptionType ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
              />
              {errors.subscriptionType && (
                <p className="text-sm text-red-500 mt-1">{errors.subscriptionType.message}</p>
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
                    <SelectTrigger className={`w-full !h-10 md:!h-14 ${errors.language ? "border-red-500" : ""}`}>
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
            
            {/* Two Column Grid for Number of Games and Number of Questions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfGames" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  Number of games
                </Label>
                <Input 
                  id="numberOfGames" 
                  placeholder="Number of games"
                  type="number"
                  {...register("numberOfGames", { 
                    required: "Number of games is required",
                    min: {
                      value: 1,
                      message: "Number of games must be at least 1"
                    }
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfGames ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
                />
                {errors.numberOfGames && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfGames.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="numberOfQuestions" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  Number of Questions
                </Label>
                <Input 
                  id="numberOfQuestions" 
                  placeholder="Number of Questions"
                  type="number"
                  {...register("numberOfQuestions", { 
                    required: "Number of questions is required",
                    min: {
                      value: 1,
                      message: "Number of questions must be at least 1"
                    }
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfQuestions ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
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
                  Number of Players
                </Label>
                <Input 
                  id="numberOfPlayers" 
                  placeholder="Number of Players"
                  type="number"
                  {...register("numberOfPlayers", { 
                    required: "Number of players is required",
                    min: {
                      value: 1,
                      message: "Number of players must be at least 1"
                    }
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.numberOfPlayers ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor`}
                />
                {errors.numberOfPlayers && (
                  <p className="text-sm text-red-500 mt-1">{errors.numberOfPlayers.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block dark:text-whiteColor">
                  Price
                </Label>
                <Input 
                  id="price" 
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  {...register("price", { 
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0"
                    }
                  })}
                  className={`w-full !h-10 md:!h-14 px-3 border border-gray-300 rounded-md bg-white ${errors.price ? "border-red-500" : ""} dark:bg-whiteColor dark:text-blackColor `}
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
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? "Update Subscription Type" : "Add Subscription Type")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
