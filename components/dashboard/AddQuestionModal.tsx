import { Controller, useForm } from 'react-hook-form';
import { FaDownload } from 'react-icons/fa6';
import { Dialog, DialogContent } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
type FormValues = {
  language?: string;
  topic?: string;
  difficulty?: string;
  freeBundle?: string;
  firebaseQuestion?: string;
  questionType?: 'Options' | 'Bools' | 'Text';
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

function AddQuestionModal({isOpen, onClose, editData}: {isOpen: boolean, onClose: () => void, editData?: any}) {
      const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
          answerTime: 60,
          points: 1,
          ...editData
        }
      });
  const questionType = watch('questionType'); // Watch the selected question type

  const onSubmit = (data: any) => {
    console.log(data);
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
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
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
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
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
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
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
                  <span className="text-gray-500">Select Option</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Firebase Question (radio input) */}
        <div className="mb-4 ">
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
        </div>

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
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                {...register('questionType')}
                type="radio"
                value="Options"
                className="h-5 w-5"
              />
              <span className="ml-2 text-sm">Options</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('questionType')}
                type="radio"
                value="Bools"
                className="h-5 w-5"
              />
              <span className="ml-2 text-sm">Bools</span>
            </label>
            <label className="flex items-center">
              <input
                {...register('questionType')}
                type="radio"
                value="Text"
                className="h-5 w-5"
              />
              <span className="ml-2 text-sm">Text</span>
            </label>
          </div>
        </div>

        {/* Options (only if question type is Options) */}
        {watch('questionType') === 'Options' && (
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
                rules={{ required: 'Answer is required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Correct Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message as string}</p>}
            </div>
          </>
        )}

        {/* Bools (only if question type is Bools) */}
        {watch('questionType') === 'Bools' && (
          <div className="mb-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
            <Controller
              name="answer"
              control={control}
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
          </div>
        )}

        {/* Text (only if question type is Text) */}
        {watch('questionType') === 'Text' && (
          <div className="mb-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer</label>
            <input
              {...register('answer')}
              type="text"
              id="answer"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Answer here"
            />
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
