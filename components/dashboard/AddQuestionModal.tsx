import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaDownload } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { Dialog, DialogContent } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
type FormValues = {
  language?: string;
  topic?: string;
  difficulty?: string;
  freeBundle?: string;
  firebaseQuestion?: string;
  questionType?: any;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer?: string;
  question?: string;
  answerTime: number;
  points: number;
  image?: File | null;
};

function AddQuestionModal({ isOpen, onClose, editData, questionData, setQuestionData }: { isOpen: boolean, onClose: () => void, editData?: any, questionData?: any, setQuestionData?: any }) {
  const [answers, setAnswers] = useState([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false }
  ]);

  const { register, handleSubmit, watch, setValue, control, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      answerTime: 60,
      points: 1,
      answer: "0", // Set default answer to first option
      ...editData
    }
  });
  
  const {token} = useToken();

  const { data: languageData } = useDataFetch(`/admin/languages`);
  const { data: topicData } = useDataFetch(`/admin/categories`);
  const { data: difficultData } = useDataFetch(`/admin/difficulties`);
  const { data: questionTypeData } = useDataFetch(`/admin/question-types`);

  // Update answers when option values change
  const optionA = watch('optionA');
  const optionB = watch('optionB');
  const optionC = watch('optionC');
  const optionD = watch('optionD');

  useEffect(() => {
    setAnswers(prev => [
      { text: optionA || "", is_correct: prev[0].is_correct },
      { text: optionB || "", is_correct: prev[1].is_correct },
      { text: optionC || "", is_correct: prev[2].is_correct },
      { text: optionD || "", is_correct: prev[3].is_correct }
    ]);
  }, [optionA, optionB, optionC, optionD]);

  // Handle answer selection
  const handleAnswerSelect = (selectedAnswer: string) => {
    setAnswers(prev => prev.map((answer, index) => ({
      ...answer,
      is_correct: index === parseInt(selectedAnswer)
    })));
    // Also update the form field value
    setValue('answer', selectedAnswer);
  };

  const onSubmit = async(data: any) => {
    const selectedQuestionType = questionTypeData?.data?.find((item: any) => item.id === data.questionType);
    let answersArray = [];

    // Create answers array based on question type
    if (selectedQuestionType?.name === 'Options') {
      answersArray = [
        {
          text: data.optionA || "",
          is_correct: data.answer === "0"
        },
        {
          text: data.optionB || "",
          is_correct: data.answer === "1"
        },
        {
          text: data.optionC || "",
          is_correct: data.answer === "2"
        },
        {
          text: data.optionD || "",
          is_correct: data.answer === "3"
        }
      ];
    } else if (selectedQuestionType?.name === 'True/False') {
      answersArray = [
        {
          text: "True",
          is_correct: data.answer === "True"
        },
        {
          text: "False",
          is_correct: data.answer === "False"
        }
      ];
    } else if (selectedQuestionType?.name === 'Text') {
      answersArray = [
        {
          text: data.answer || "",
          is_correct: true
        }
      ];
    }

    const formData = {
      text: data.question,
      category_id: data.topic,
      language_id: data.language,
      difficulty_id: data.difficulty,
      question_type_id: data.questionType,
      free_bundle: data.freeBundle === "true",
      time: data.answerTime,
      points: data.points,
      answers: JSON.stringify(answersArray)
    };
     try {
      if (editData?.id) {
        // Update existing item
        const endpoint = `/admin/questions/${editData.id}`;
        const response = await UserService.updateData(endpoint, formData, token);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          const updatedData = questionData?.map(item =>
            item.id === editData.id
              ? { ...item, text: data.question, category_id: data.topic, language_id: data.language, difficulty_id: data.difficulty, question_type_id: data.questionType, free_bundle: data.freeBundle, firebase: data.firebaseQuestion, time: data.answerTime, points: data.points, answers: answersArray }
              : item
          );    
          setQuestionData(updatedData);
          reset();
          onClose();
        }
      } else {
        // Add new item
        const endpoint = `/admin/questions`;
        const response = await UserService.addFormData(endpoint, formData, token);
        console.log("response create question", response);
        
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          questionData?.unshift(response?.data?.data);
          reset();
          onClose();
        }
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    }
    
    console.log('Form data with answers:', formData);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-[95vw] md:w-[650px] lg:max-w-[700px] max-h-[95vh] overflow-y-auto'>
          <div className="w-full ">
            <h2 className="text-2xl font-semibold text-center mb-6">Create Question</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Row: Language | Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language (select dropdown) */}
                <div className="mb-4">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                  <Controller
                    name="language"
                    control={control}
                    rules={{ required: 'Language is required' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Language" />
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
                  {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message as string}</p>}
                </div>

                {/* Topic (select dropdown) */}
                <div className="mb-4">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
                  <Controller
                    name="topic"
                    control={control}
                    rules={{ required: 'Topic is required' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            topicData?.data?.map((item: any) => (
                              <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic.message as string}</p>}
                </div>
              </div>

              {/* Difficulty (select dropdown) */}
              <div className="mb-4">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                <Controller
                  name="difficulty"
                  control={control}
                  rules={{ required: 'Difficulty is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          difficultData?.data?.map((item: any) => (
                            <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty.message as string}</p>}
              </div>

              {/* Question (text input) */}
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
                <input
                  {...register('question', { required: 'Question is required' })}
                  type="text"
                  id="question"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Question"
                />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message as string}</p>}
              </div>

              {/* Answer Time (number) */}
              <div className="mb-4">
                <label htmlFor="answerTime" className="block text-sm font-medium text-gray-700">Answer Time</label>
                <input
                  {...register('answerTime', { required: 'Answer time is required', valueAsNumber: true })}
                  type="number"
                  id="answerTime"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="60"
                  min={1}
                />
                {errors.answerTime && <p className="text-red-500 text-xs mt-1">{errors.answerTime.message as string}</p>}
              </div>

              {/* No. of Points (number) */}
              <div className="mb-6">
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">No. of Points</label>
                <input
                  {...register('points', { required: 'Points are required', valueAsNumber: true })}
                  type="number"
                  id="points"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="1"
                  min={1}
                />
                {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points.message as string}</p>}
              </div>

              {/* Free Bundle (select dropdown) */}
              <div className="mb-4 ">
                <label htmlFor="freeBundle" className="block text-sm font-medium text-gray-700">Free Bundle</label>
                <Controller
                  name="freeBundle"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Firebase Question (radio input) */}
              {/* <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-700">Firebase Question</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('firebaseQuestion')}
                      type="radio"
                      value="true"
                      className="h-5 w-5"
                    />
                    <span className="ml-2 text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('firebaseQuestion')}
                      type="radio"
                      value="false"
                      className="h-5 w-5"
                    />
                    <span className="ml-2 text-sm">No</span>
                  </label>
                </div>
              </div> */}

              {/* File (image upload) */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">File</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-1 w-full border border-gray-300 rounded-md h-32 flex items-start p-4">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => field.onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      />
                      <label htmlFor="image" className="cursor-pointer flex items-center gap-3 select-none">
                        <FaDownload className='text-primaryColor' />
                        <span className="text-gray-700">{field.value ? (field.value as File).name : 'file to upload'}</span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Question Type</label>
                <div className="flex flex-wrap gap-4">
                  {questionTypeData?.data?.map((item: any) => (
                    <label key={item.id} className="flex items-center">
                      <input
                        {...register('questionType')}
                        type="radio"
                        value={item.id}
                        className="h-5 w-5"
                      />
                      <span className="ml-2 text-sm">{item.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options (only if question type is Options) */}
              {questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'Options' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">Option A</label>
                    <input
                      {...register('optionA')}
                      type="text"
                      id="optionA"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">Option B</label>
                    <input
                      {...register('optionB')}
                      type="text"
                      id="optionB"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionC" className="block text-sm font-medium text-gray-700">Option C</label>
                    <input
                      {...register('optionC')}
                      type="text"
                      id="optionC"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionD" className="block text-sm font-medium text-gray-700">Option D</label>
                    <input
                      {...register('optionD')}
                      type="text"
                      id="optionD"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Answer for Options */}
                  <div className="mb-4">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                    <Controller
                      name="answer"
                      control={control}
                      rules={{ 
                        required: questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'Options' ? 'Answer is required' : false 
                      }}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleAnswerSelect(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Correct Option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">A</SelectItem>
                            <SelectItem value="1">B</SelectItem>
                            <SelectItem value="2">C</SelectItem>
                            <SelectItem value="3">D</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
                  </div>
                </>
              )}

              {/* True/False (only if question type is True/False) */}
              {questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'True/False' && (
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <Controller
                    name="answer"
                    control={control}
                    rules={{ 
                      required: questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'True/False' ? 'Answer is required' : false 
                    }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select True / False" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">True</SelectItem>
                          <SelectItem value="False">False</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
                </div>
              )}

              {/* Text (only if question type is Text) */}
              {questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'Text' && (
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <input
                    {...register('answer', { 
                      required: questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name === 'Text' ? 'Answer is required' : false 
                    })}
                    type="text"
                    id="answer"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    placeholder="Answer here"
                  />
                  {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Question
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddQuestionModal
