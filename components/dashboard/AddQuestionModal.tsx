import { Button } from '@/components/ui/button';
import { useAddQuestionMutation, useGetDificultiesQuery, useGetLanguagesQuery, useGetQuestionTypeQuery, useGetTopicsQuery, useUpdateQuestionMutation } from '@/feature/api/apiSlice';
import { useToken } from '@/hooks/useToken';
import useTranslation from '@/hooks/useTranslation';
import Image from 'next/image';
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

function AddQuestionModal({ isOpen, onClose, editData, }: { isOpen: boolean, onClose: () => void, editData?: any, }) {
  const { t } = useTranslation()
  // State for storing uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [updateQuestion]= useUpdateQuestionMutation()
  const [addQuestion]= useAddQuestionMutation()
  // State for storing existing file URLs from edit data
  const [existingFiles, setExistingFiles] = useState<{ [key: string]: string }>({});
  // Object URLs for previews
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});

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

  const { token } = useToken();
  const selectedLanguage = watch('language');
  const { data: languageData } = useGetLanguagesQuery({params:`limit=1000&page=1`});


  // Get language_id for filtering - use selected language or edit data language
  const languageId = selectedLanguage || (editData?.language?.id ?? editData?.language_id ?? editData?.language);

  const { data: topicData } = useGetTopicsQuery({params:languageId ? `language_id=${languageId}` : ""});
  const { data: difficultData } = useGetDificultiesQuery({params:languageId ? `language_id=${languageId}` : ""});
  const { data: questionTypeData, isLoading: questionTypeLoading, isError: questionTypeError } = useGetQuestionTypeQuery({});

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
          const existingFilesData: { [key: string]: string } = {};

          if (editData.answers[0]?.answer_file_url) {
            existingFilesData.optionA = editData.answers[0].answer_file_url;
            // Create a mock File object for display purposes
            const mockFileA = new File([''], editData.answers[0].answer_file_url, { type: 'image/jpeg' });
            setValue("optionAFile", mockFileA);
          }
          if (editData.answers[1]?.answer_file_url) {
            existingFilesData.optionB = editData.answers[1].answer_file_url;
            const mockFileB = new File([''], editData.answers[1].answer_file_url, { type: 'image/jpeg' });
            setValue("optionBFile", mockFileB);
          }
          if (editData.answers[2]?.answer_file_url) {
            existingFilesData.optionC = editData.answers[2].answer_file_url;
            const mockFileC = new File([''], editData.answers[2].answer_file_url, { type: 'image/jpeg' });
            setValue("optionCFile", mockFileC);
          }
          if (editData.answers[3]?.answer_file_url) {
            existingFilesData.optionD = editData.answers[3].answer_file_url;
            const mockFileD = new File([''], editData.answers[3].answer_file_url, { type: 'image/jpeg' });
            setValue("optionDFile", mockFileD);
          }

          setExistingFiles(existingFilesData);

          // Find correct answer index
          const correctIndex = Math.max(0, editData.answers.findIndex((answer: any) => answer.is_correct));
          setValue("answer", String(correctIndex));

          // No local answers state needed; values are derived on submit
        } else if (selectedQuestionType === 'True/False' || selectedQuestionType == "Boolean") {
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


  // Handle file upload and store in state array
  const handleFileUpload = (file: File | null, optionName: string) => {
    if (file) {
      setUploadedFiles(prevFiles => {
        // Remove existing file for this option if any
        const filteredFiles = prevFiles.filter(f => !f.name.includes(optionName));
        // Add new file
        return [...filteredFiles, file];
      });
    }
  };

  // Live watch of file fields
  const imageFile = watch('image') as File | string | null;
  const optionAWatch = watch('optionAFile') as File | null;
  const optionBWatch = watch('optionBFile') as File | null;
  const optionCWatch = watch('optionCFile') as File | null;
  const optionDWatch = watch('optionDFile') as File | null;

  // Manage object URLs and cleanup
  useEffect(() => {
    const entries: Array<{ key: string; file: File | null | undefined }> = [
      { key: 'image', file: typeof imageFile !== 'string' ? (imageFile as File | null) : null },
      { key: 'optionA', file: optionAWatch },
      { key: 'optionB', file: optionBWatch },
      { key: 'optionC', file: optionCWatch },
      { key: 'optionD', file: optionDWatch },
    ];

    const nextUrls: Record<string, string> = {};
    const toRevoke: string[] = [];

    for (const { key, file } of entries) {
      if (file && file.size > 0) {
        const url = URL.createObjectURL(file);
        nextUrls[key] = url;
      }
    }

    for (const prevKey in objectUrls) {
      if (!nextUrls[prevKey]) {
        toRevoke.push(objectUrls[prevKey]);
      }
    }

    setObjectUrls(nextUrls);

    return () => {
      toRevoke.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile, optionAWatch, optionBWatch, optionCWatch, optionDWatch]);

  const getPreviewSrc = (key: 'image' | 'optionA' | 'optionB' | 'optionC' | 'optionD'): string | null => {
    if (objectUrls[key]) return objectUrls[key];
    if (key !== 'image' && existingFiles[key]) return existingFiles[key];
    if (key === 'image') {
      // Prefer value bound to form if it's a URL string
      if (typeof imageFile === 'string' && imageFile) return imageFile;
      // Fallbacks for edit mode where image URL may be on different keys
      const possible = [
        (editData && (editData.image as string)) || '',
        (editData && (editData.image_url as string)) || '',
        (editData && (editData.question_file_url as string)) || '',
        (editData && (editData.question_file as string)) || '',
      ].find((u) => typeof u === 'string' && u.length > 0);
      if (possible) return possible as string;
    }
    return null;
  };

  const detectMediaKind = (src: string, file?: File | null): 'image' | 'audio' | 'video' => {
    if (file && file.type) {
      if (file.type.startsWith('image')) return 'image';
      if (file.type.startsWith('audio')) return 'audio';
      if (file.type.startsWith('video')) return 'video';
    }
    const lower = src.toLowerCase();
    if (/(mp4|webm|ogg|mov|m4v)$/.test(lower)) return 'video';
    if (/(mp3|wav|ogg|m4a)$/.test(lower)) return 'audio';
    return 'image';
  };

  const onSubmit = async (data: any) => {
    const selectedQuestionType = questionTypeData?.data?.find((item: any) => item.id === data.questionType);
    let answersArray = [];
    let answerFiles = [];

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
    } else if (selectedQuestionType?.name === 'Boolean' || selectedQuestionType == "Boolean") {
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

    try {
      if (editData?.id) {

        const response = await updateQuestion({id:editData?.id, data:formData});
        
        
        if (response?.data?.success) {
          toast.success(response?.data?.message);
         
          reset();
          onClose();
        }
      } else {

        const response = await addQuestion({data:formData});
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          reset();
          onClose();
        }
      }
    } catch (error) {
      toast.error("Failed to save question");
    }

  };

  // Create a reusable component for option input
  const OptionInput = ({ 
    label, 
    optionKey, 
    register, 
    control, 
    watch, 
    t 
  }: any) => {
    const optionValue = watch(optionKey);
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} 
        </label>
        <div className="flex gap-3">
          <input
            {...register(optionKey)}
            type="text"
            className="mt-1 p-2 w-[70%] border border-gray-300 rounded-md"
            placeholder={t("enter_option_text")}
          />
          <Controller
            name={`${optionKey}File`}
            control={control}
            render={({ field }) => (
              <div className="w-[30%] mt-1 border border-gray-300 overflow-hidden rounded-md h-10 flex items-center p-2">
                <input
                  type="file"
                  accept="image/*,audio/*,video/*"
                  className="hidden"
                  id={`${optionKey}File`}
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                    field.onChange(file);
                    handleFileUpload(file, optionKey);
                  }}
                />
                <label htmlFor={`${optionKey}File`} className="cursor-pointer text-xs text-gray-600 flex items-center gap-1">
                  <IoCloudUploadOutline className='text-primaryColor text-base' />
                  <span>{field.value ? (field.value as File).name : t('upload')}</span>
                </label>
              </div>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-[95vw] md:w-[650px] lg:max-w-[700px] max-h-[95vh] overflow-y-auto'>
          <div className="w-full ">
            <h2 className="text-2xl font-semibold text-center mb-6">{editData ? t('update_questions') : t('create_questions')}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Row: Language | Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">{t("language")}</label>
                  <Controller
                    name="language"
                    control={control}
                    rules={{ required: t("language_is_required") }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
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
                  {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message as string}</p>}
                </div>
                {/* Topic (select dropdown) */}
                <div className="mb-4">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700">{t("topic")}</label>
                  <Controller
                    name="topic"
                    control={control}
                    rules={{ required: t("topic_is_required") }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("topic")} />
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
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">{t("difficulty")}</label>
                <Controller
                  name="difficulty"
                  control={control}
                  rules={{ required: t("difficulty_is_required") }}
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
                        <SelectValue placeholder={t("difficulty")} />
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
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">{t("question")}</label>
                <input
                  {...register('question', { required: t("question_name_is_required") })}
                  type="text"
                  id="question"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder={t("question")}
                />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message as string}</p>}
              </div>

              {/* Answer Time (number) */}
              <div className="mb-4">
                <label htmlFor="answerTime" className="block text-sm font-medium text-gray-700">{t("answer_time")}</label>
                <input
                  {...register('answerTime', { required: t("answer_time_is_required"), valueAsNumber: true })}
                  type="number"
                  id="answerTime"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder={t("60")}
                  min={1}
                />
                {errors.answerTime && <p className="text-red-500 text-xs mt-1">{errors.answerTime.message as string}</p>}
              </div>

              {/* No. of Points (number) */}
              <div className="mb-6">
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">{t("no_of_point")}</label>
                <input
                  {...register('points', { required: t("points_are_required"), valueAsNumber: true })}
                  type="number"
                  id="points"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 dark:bg-black
                   cursor-not-allowed"
                  placeholder={t("1")}
                  min={1}
                  disabled
                  readOnly
                />
                {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points.message as string}</p>}
              </div>

              {/* Free Bundle (select dropdown) */}
              <div className="mb-4 ">
                <label htmlFor="freeBundle" className="block text-sm font-medium text-gray-700">{t("free_bundle")}</label>
                <Controller
                  name="freeBundle"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("select_option")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{t("true")}</SelectItem>
                        <SelectItem value="false">{t("false")}</SelectItem>
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
                    <span className="ml-2 text-sm">{t('yes')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('firebaseQuestion')}
                      type="radio"
                      value="false"
                      className="h-5 w-5"
                    />
                    <span className="ml-2 text-sm">{t('no')}</span>
                  </label>
                </div>
              </div> */}

              {/* File (image/audio/video upload) */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">{t("file_image_audio_video")}</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-1 w-full border border-gray-300 rounded-md flex flex-col gap-3 p-4">
                      <input
                        id="image"
                        type="file"
                        accept="image/*,audio/*,video/*"
                        className="hidden"
                        onChange={(e) => field.onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      />
                      <label htmlFor="image" className="cursor-pointer flex items-center gap-3 select-none">
                        <FaDownload className='text-primaryColor' />
                        <span className="text-gray-700">{field.value ? (field.value as File).name : t("upload_image_audio_video")}</span>
                      </label>
                      {(() => {
                        const src = getPreviewSrc('image');
                        if (!src) return null;
                        const kind = detectMediaKind(src, typeof imageFile !== 'string' ? (imageFile as File | null) : null);
                        return (
                          <div className="border rounded-md p-2">
                            {kind === 'image' && (
                              <Image src={src} alt="preview" width={100} height={100} className="h-28 w-auto object-contain" />
                            )}
                            {kind === 'audio' && (
                              <div className="relative">
                                {src.startsWith('blob:') ? (
                                  // Local preview audio (blob URL)
                                  <audio controls src={src} className="w-full" />
                                ) : (
                                  // Server audio with CORS handling
                                  <div className="relative">
                                    <audio
                                      controls
                                      className="w-full"
                                      preload="none"
                                      crossOrigin="anonymous"
                                      onLoadStart={() => console.log('Audio loading started for:', src)}
                                      onCanPlay={() => console.log('Audio can play:', src)}
                                      onLoadedData={() => console.log('Audio data loaded:', src)}
                                      onError={(e) => {
                                        console.error('Server audio error:', e);
                                        console.error('Audio src:', src);
                                        console.error('NetworkState:', e.currentTarget.networkState);
                                        console.error('ReadyState:', e.currentTarget.readyState);

                                        // Try without CORS
                                        if (e.currentTarget.crossOrigin) {
                                          console.log('Retrying audio without CORS...');
                                          e.currentTarget.crossOrigin = null;
                                          e.currentTarget.load();
                                        }
                                      }}
                                    >
                                      <source src={src} type="audio/mpeg" />
                                      <source src={src} type="audio/wav" />
                                      <source src={src} type="audio/ogg" />
                                      Your browser does not support the audio element.
                                    </audio>


                                  </div>
                                )}
                              </div>
                            )}
                            {kind === 'video' && (
                              <div className="relative">
                                {src.startsWith('blob:') ? (
                                  // Local preview video (blob URL)
                                  <video
                                    controls
                                    src={src}
                                    className="h-28 w-auto object-contain rounded-lg border"
                                    width={200}
                                    height={100}
                                    preload="metadata"
                                    playsInline
                                    muted
                                    style={{ maxWidth: '100%', maxHeight: '112px' }}
                                  />
                                ) : (
                                  // Server video with CORS handling
                                  <div className="relative">
                                    <video
                                      controls
                                      className="h-28 w-auto object-contain rounded-lg border bg-gray-100"
                                      width={200}
                                      height={100}
                                      preload="none"
                                      playsInline
                                      crossOrigin="anonymous"
                                      onLoadStart={() => console.log('Video loading started for:', src)}
                                      onCanPlay={() => console.log('Video can play:', src)}
                                      onLoadedData={() => console.log('Video data loaded:', src)}
                                      onLoadedMetadata={() => console.log('Video metadata loaded:', src)}
                                      onError={(e) => {
                                        console.error('Server video error:', e);
                                        console.error('Video src:', src);
                                        console.error('NetworkState:', e.currentTarget.networkState);
                                        console.error('ReadyState:', e.currentTarget.readyState);

                                        // Try without CORS
                                        if (e.currentTarget.crossOrigin) {
                                          console.log('Retrying without CORS...');
                                          e.currentTarget.crossOrigin = null;
                                          e.currentTarget.load();
                                        }
                                      }}
                                      style={{ maxWidth: '100%', maxHeight: '112px' }}
                                    >
                                      <source src={src} type="video/mp4" />
                                      <source src={src} type="video/webm" />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                />
              </div>

              {/* Question Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{t("question_type")}</label>
                {questionTypeLoading ? (
                  <div className="text-sm text-gray-500">{t("loading_question_types")}</div>
                ) : questionTypeError ? (
                  <div className="text-sm text-red-500">{t("error_loading_question_types")}: {questionTypeError}</div>
                ) : !questionTypeData?.data || questionTypeData.data.length === 0 ? (
                  <div className="text-sm text-gray-500">{t("no_question_types_available")}</div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {questionTypeData?.data?.map((item: any) => (
                      <label key={item.id} className="flex items-center">
                        <input
                          {...register('questionType', { required: t("question_type_is_required") })}
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
                  <OptionInput label={t("optionA")} optionKey="optionA" register={register} control={control} watch={watch} t={t} />
                  <OptionInput label={t("optionB")} optionKey="optionB" register={register} control={control} watch={watch} t={t} />
                  <OptionInput label={t("optionC")} optionKey="optionC" register={register} control={control} watch={watch} t={t} />
                  <OptionInput label={t("optionD")} optionKey="optionD" register={register} control={control} watch={watch} t={t} />

                  {/* Answer for Options - Shows actual option values */}
                  <div className="mb-4">
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">{t("answer")}</label>
                    <Controller
                      name="answer"
                      control={control}
                      rules={{ required: selectedTypeName === 'Options' ? t("answer_is_required") : false }}
                      render={({ field }) => {
                        const optionA = watch('optionA') || '';
                        const optionB = watch('optionB') || '';
                        const optionC = watch('optionC') || '';
                        const optionD = watch('optionD') || '';
                        const options = [
                          { value: '0', label: optionA || t("a"), text: optionA },
                          { value: '1', label: optionB || t("b"), text: optionB },
                          { value: '2', label: optionC || t("c"), text: optionC },
                          { value: '3', label: optionD || t("d"), text: optionD },
                        ];

                        return (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t("select_correct_option")} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                    {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
                  </div>
                </>
              )}

              {/* True/False (only if question type is True/False) */}
              {(selectedTypeName === 'True/False' || selectedTypeName == "Boolean") && (
                <div className="mb-4">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">{t("answer")}</label>
                  <Controller
                    name="answer"
                    control={control}
                    rules={{ required: (selectedTypeName === 'True/False' || selectedTypeName == "Boolean") ? t("answer_is_required") : false }}
                    render={({ field }) => (

                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full !text-black">
                          <SelectValue placeholder={t("select_true_false")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="True">{t("true")}</SelectItem>
                          <SelectItem value="False">{t("false")}</SelectItem>
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
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">{t("answer")}</label>
                  <input
                    {...register('answer', { required: selectedTypeName === 'Text' ? t("answer_is_required") : false })}
                    type="text"
                    id="answer"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    placeholder={t("answer_here")}
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
                {isSubmitting ? (editData ? t("updating") : t("creating")) : (editData ? t("update_questions") : t("add_questions"))}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddQuestionModal
