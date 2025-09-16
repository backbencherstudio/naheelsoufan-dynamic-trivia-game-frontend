import { Button } from '@/components/ui/button';
import useDataFetch from '@/hooks/useDataFetch';
import { useToken } from '@/hooks/useToken';
import { UserService } from '@/service/user/user.service';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaDownload } from 'react-icons/fa6';
import { IoCloudUploadOutline } from "react-icons/io5";
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
  optionAFile?: File | null;
  optionBFile?: File | null;
  optionCFile?: File | null;
  optionDFile?: File | null;
};

function AddQuestionModal({ isOpen, onClose, editData, questionData, setQuestionData }: { isOpen: boolean, onClose: () => void, editData?: any, questionData?: any, setQuestionData?: any }) {

  // State for storing uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // State for storing existing file URLs from edit data
  const [existingFiles, setExistingFiles] = useState<{[key: string]: string}>({});

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    defaultValues: {
      answerTime: 30,
      points: 1,
      questionType: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "0",
      question: "",
      language: "",
      topic: "",
      difficulty: "",
      freeBundle: "false",
      firebaseQuestion: "false",
      image: null,
      optionAFile: null,
      optionBFile: null,
      optionCFile: null,
      optionDFile: null,
    }
  });
  
  const {token} = useToken();
  const { data: languageData } = useDataFetch(`/admin/languages`);
  const { data: topicData } = useDataFetch(`/admin/categories`);
  const { data: difficultData } = useDataFetch(`/admin/difficulties`);
  const { data: questionTypeData, loading: questionTypeLoading, error: questionTypeError } = useDataFetch(`/admin/question-types`);

  // Current selected question type name (derived once for rendering and validation)
  const selectedTypeName = questionTypeData?.data?.find((item: any) => item.id === watch('questionType'))?.name;

  // Update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue("question", editData.text);
      const languageId = editData.language?.id ?? editData.language_id ?? editData.language;
      const categoryId = editData.category?.id ?? editData.category_id ?? editData.category;
      const difficultyId = editData.difficulty?.id ?? editData.difficulty_id ?? editData.difficulty;
      const questionTypeId = editData.question_type?.id ?? editData.question_type_id ?? editData.question_type;
      setValue("language", String(languageId || ""));
      setValue("topic", String(categoryId || ""));
      setValue("difficulty", String(difficultyId || ""));
      setValue("questionType", String(questionTypeId || ""));
      setValue("freeBundle", editData.free_bundle ? "true" : "false");
      setValue("firebaseQuestion", editData.firebase ? "true" : "false");
      setValue("answerTime", editData.time);
      setValue("points", editData.points);
      setValue("image", editData.image);

      // Handle answers based on question type
      if (editData.answers && editData.answers.length > 0) {
        const selectedQuestionType =
          editData.question_type?.name ||
          questionTypeData?.data?.find((item: any) => item.id === questionTypeId)?.name;

        if (selectedQuestionType === 'Options') {
          // Set options A, B, C, D
          setValue("optionA", editData.answers[0]?.text || "");
          setValue("optionB", editData.answers[1]?.text || "");
          setValue("optionC", editData.answers[2]?.text || "");
          setValue("optionD", editData.answers[3]?.text || "");

          // Set answer files if they exist
          const existingFilesData: {[key: string]: string} = {};
          
          if (editData.answers[0]?.file_url) {
            existingFilesData.optionA = editData.answers[0].file_url;
            // Create a mock File object for display purposes
            const mockFileA = new File([''], editData.answers[0].file_url, { type: 'image/jpeg' });
            setValue("optionAFile", mockFileA);
          }
          if (editData.answers[1]?.file_url) {
            existingFilesData.optionB = editData.answers[1].file_url;
            const mockFileB = new File([''], editData.answers[1].file_url, { type: 'image/jpeg' });
            setValue("optionBFile", mockFileB);
          }
          if (editData.answers[2]?.file_url) {
            existingFilesData.optionC = editData.answers[2].file_url;
            const mockFileC = new File([''], editData.answers[2].file_url, { type: 'image/jpeg' });
            setValue("optionCFile", mockFileC);
          }
          if (editData.answers[3]?.file_url) {
            existingFilesData.optionD = editData.answers[3].file_url;
            const mockFileD = new File([''], editData.answers[3].file_url, { type: 'image/jpeg' });
            setValue("optionDFile", mockFileD);
          }
          
          setExistingFiles(existingFilesData);

          // Find correct answer index
          const correctIndex = Math.max(0, editData.answers.findIndex((answer: any) => answer.is_correct));
          setValue("answer", String(correctIndex));

          // No local answers state needed; values are derived on submit
        } else if (selectedQuestionType === 'True/False') {
          // Set True/False answer
          const correctAnswer = editData.answers.find((answer: any) => answer.is_correct);
          setValue("answer", correctAnswer?.text || "True");
        } else if (selectedQuestionType === 'Text') {
          // Set text answer
          const correctAnswer = editData.answers.find((answer: any) => answer.is_correct);
          setValue("answer", correctAnswer?.text || "");
        }
      }
    } else {
      // Reset form for new question
      reset();
      setExistingFiles({});
      setUploadedFiles([]);
    }
  }, [editData, setValue, questionTypeData, reset]);
  // Handle answer selection (no extra state needed)
  const handleAnswerSelect = (selectedAnswer: string) => {
    setValue('answer', selectedAnswer);
  };

  // Handle file upload and store in state array
  const handleFileUpload = (file: File | null, optionName: string) => {
    if (file) {
      setUploadedFiles(prevFiles => {
        // Remove existing file for this option if any
        const filteredFiles = prevFiles.filter(f => !f.name.includes(optionName));
        // Add new file
        return [...filteredFiles, file];
      });
      console.log(`File uploaded for ${optionName}:`, file.name);
      console.log("Current uploaded files:", uploadedFiles);
    }
  };

  const onSubmit = async(data: any) => {
    const selectedQuestionType = questionTypeData?.data?.find((item: any) => item.id === data.questionType);
    let answersArray = [];
    let answerFiles = [];
    console.log(answerFiles);
    
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
      
      // Store answer files for Options - format: [optionimage1.jpg, optionimage2.jpg, optionimage3.jpg, optionimage4.jpg]
      if (data.optionAFile) {
        answerFiles.push(data.optionAFile.name || 'optionimage1.jpg');
      }
      if (data.optionBFile) {
        answerFiles.push(data.optionBFile.name || 'optionimage2.jpg');
      }
      if (data.optionCFile) {
        answerFiles.push(data.optionCFile.name || 'optionimage3.jpg');
      }
      if (data.optionDFile) {
        answerFiles.push(data.optionDFile.name || 'optionimage4.jpg');
      }
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

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('text', data.question);
    formData.append('category_id', data.topic);
    formData.append('language_id', data.language);
    formData.append('difficulty_id', data.difficulty);
    formData.append('question_type_id', data.questionType);
    formData.append('free_bundle', String(data.freeBundle === "true"));
    formData.append('time', data.answerTime.toString());
    formData.append('points', data.points.toString());
    formData.append('answers', JSON.stringify(answersArray));
    
    // Add question file
    if (data.image) {
      formData.append('questionFile', data.image);
    }
    
    // Add answer files (only if they are new files, not existing ones)
    if (data.optionAFile && !existingFiles.optionA) {
      formData.append('answerFiles', data.optionAFile);
    }
    if (data.optionBFile && !existingFiles.optionB) {
      formData.append('answerFiles', data.optionBFile);
    }
    if (data.optionCFile && !existingFiles.optionC) {
      formData.append('answerFiles', data.optionCFile);
    }
    if (data.optionDFile && !existingFiles.optionD) {
      formData.append('answerFiles', data.optionDFile);
    }
    
    // Log existing files for debugging
    console.log("Existing files:", existingFiles);
     try {
      if (editData?.id) {
        // Update existing item - use addFormData for FormData
        const endpoint = `/admin/questions/${editData.id}`;
        const response = await UserService.updateData(endpoint, formData, token);
        console.log(response);
        
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
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Auto-populate points from selected difficulty
                        const selectedDifficulty = difficultData?.data?.find((item: any) => item.id === value);
                        if (selectedDifficulty?.points) {
                          setValue('points', selectedDifficulty.points);
                        }
                      }}
                    >
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  placeholder="1"
                  min={1}
                  disabled
                  readOnly
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

              {/* File (image/audio/video upload) */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">File (Image/Audio/Video)</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-1 w-full border border-gray-300 rounded-md h-32 flex items-start p-4">
                      <input
                        id="image"
                        type="file"
                        accept="image/*,audio/*,video/*"
                        className="hidden"
                        onChange={(e) => field.onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      />
                      <label htmlFor="image" className="cursor-pointer flex items-center gap-3 select-none">
                        <FaDownload className='text-primaryColor' />
                        <span className="text-gray-700">{field.value ? (field.value as File).name : 'Upload Image, Audio or Video'}</span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Question Type</label>
                {questionTypeLoading ? (
                  <div className="text-sm text-gray-500">Loading question types...</div>
                ) : questionTypeError ? (
                  <div className="text-sm text-red-500">Error loading question types: {questionTypeError}</div>
                ) : !questionTypeData?.data || questionTypeData.data.length === 0 ? (
                  <div className="text-sm text-gray-500">No question types available</div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {questionTypeData?.data?.map((item: any) => (
                      <label key={item.id} className="flex items-center">
                        <input
                          {...register('questionType', { required: 'Question type is required' })}
                          type="radio"
                          value={item.id}
                          className="h-5 w-5"
                        />
                        <span className="ml-2 text-sm">{item.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.questionType && <p className="text-red-500 text-xs mt-1">{errors.questionType.message as string}</p>}
              </div>

              {/* Options (only if question type is Options) */}
              {selectedTypeName === 'Options' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">Option A</label>
                    <div className="flex gap-3">
                      <input
                        {...register('optionA')}
                        type="text"
                        id="optionA"
                        className="mt-1 p-2 w-[70%] border border-gray-300 rounded-md"
                      />
                      <Controller
                        name="optionAFile"
                        control={control}
                        render={({ field }) => (
                          <div className="w-[30%] mt-1 border border-gray-300 overflow-hidden rounded-md h-10 flex items-center p-2">
                            <input
                              type="file"
                              accept="image/*,audio/*,video/*"
                              className="hidden"
                              id="optionAFile"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                field.onChange(file);
                                handleFileUpload(file, 'OptionA');
                              }}
                            />
                            <label htmlFor="optionAFile" className="cursor-pointer text-xs text-gray-600 flex items-center gap-1">
                              <IoCloudUploadOutline  className='text-primaryColor text-base' />
                              <span>{field.value ? (field.value as File).name : 'Upload'}</span>
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">Option B</label>
                    <div className="flex gap-3">
                      <input
                        {...register('optionB')}
                        type="text"
                        id="optionB"
                        className="mt-1 p-2 w-[70%] border border-gray-300 rounded-md"
                      />
                      <Controller
                        name="optionBFile"
                        control={control}
                        render={({ field }) => (
                          <div className="w-[30%] mt-1 border border-gray-300 overflow-hidden rounded-md h-10 flex items-center p-2">
                            <input
                              type="file"
                              accept="image/*,audio/*,video/*"
                              className="hidden"
                              id="optionBFile"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                field.onChange(file);
                                handleFileUpload(file, 'OptionB');
                              }}
                            />
                            <label htmlFor="optionBFile" className="cursor-pointer text-xs text-gray-600 flex items-center gap-1">
                              <IoCloudUploadOutline className='text-primaryColor text-sm' />
                              <span>{field.value ? (field.value as File).name : 'Upload'}</span>
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionC" className="block text-sm font-medium text-gray-700">Option C</label>
                    <div className="flex gap-3">
                      <input
                        {...register('optionC')}
                        type="text"
                        id="optionC"
                        className="mt-1 p-2 w-[70%] border border-gray-300 rounded-md"
                      />
                      <Controller
                        name="optionCFile"
                        control={control}
                        render={({ field }) => (
                          <div className="w-[30%] mt-1 border border-gray-300 overflow-hidden rounded-md h-10 flex items-center p-2">
                            <input
                              type="file"
                              accept="image/*,audio/*,video/*"
                              className="hidden"
                              id="optionCFile"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                field.onChange(file);
                                handleFileUpload(file, 'OptionC');
                              }}
                            />
                            <label htmlFor="optionCFile" className="cursor-pointer text-xs text-gray-600 flex items-center gap-1">
                              <IoCloudUploadOutline className='text-primaryColor text-sm' />
                              <span>{field.value ? (field.value as File).name : 'Upload'}</span>
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="optionD" className="block text-sm font-medium text-gray-700">Option D</label>
                    <div className="flex gap-3">
                      <input
                        {...register('optionD')}
                        type="text"
                        id="optionD"
                        className="mt-1 p-2 w-[70%] border border-gray-300 rounded-md"
                      />
                      <Controller
                        name="optionDFile"
                        control={control}
                        render={({ field }) => (
                          <div className="w-[30%] mt-1 border border-gray-300  overflow-hidden rounded-md h-10 flex items-center p-2">
                            <input
                              type="file"
                              accept="image/*,audio/*,video/*"
                              className="hidden"
                              id="optionDFile"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                field.onChange(file);
                                handleFileUpload(file, 'OptionD');
                              }}
                            />
                            <label htmlFor="optionDFile" className="cursor-pointer text-xs text-gray-600 flex items-center gap-1">
                              <IoCloudUploadOutline className='text-primaryColor  text-sm' />
                              <span>{field.value ? (field.value as File).name : 'Upload'}</span>
                            </label>
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Answer for Options */}
                  <div className="mb-4">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                    <Controller
                      name="answer"
                      control={control}
                      rules={{ required: selectedTypeName === 'Options' ? 'Answer is required' : false }}
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
              {selectedTypeName === 'True/False' && (
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <Controller
                    name="answer"
                    control={control}
                    rules={{ required: selectedTypeName === 'True/False' ? 'Answer is required' : false }}
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
              {selectedTypeName === 'Text' && (
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
                  <input
                    {...register('answer', { required: selectedTypeName === 'Text' ? 'Answer is required' : false })}
                    type="text"
                    id="answer"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    placeholder="Answer here"
                  />
                  {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (editData ? 'Updating...' : 'Adding...') : (editData ? 'Update Question' : 'Add Question')}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddQuestionModal
